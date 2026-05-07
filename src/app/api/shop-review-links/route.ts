import { NextResponse } from "next/server";

type StoreApiItem = {
    storeId: string;
    storeName: string;
    locality?: string;
    city?: string;
    state?: string;
    businessProfileId?: string;
    latitude?: string;
    longitude?: string;
};

export async function GET() {
    const webhookUrl = process.env.STORES_WEBHOOK_URL;
    const tenantId = process.env.X_TENANT_ID;

    if (!webhookUrl) {
        return NextResponse.json(
            { error: "STORES_WEBHOOK_URL is not configured" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "GET",
            headers: { "X-tenant-id": tenantId ?? "" },
            cache: "no-store",
        });

        if (!response.ok) {
            const text = await response.text();
            return NextResponse.json(
                { error: `Upstream error: ${response.status}`, detail: text },
                { status: response.status }
            );
        }

        const data = await response.json();
        const raw: StoreApiItem[] = Array.isArray(data) ? data : (data.data ?? []);

        const locations = raw.map((store) => {
            const placeId = (store.businessProfileId ?? "").trim();
            const addressParts = [store.locality, store.city, store.state].filter(Boolean);
            return {
                value: store.storeId,
                label: store.storeName,
                address: addressParts.join(", "),
                placeId,
                latitude: store.latitude ?? null,
                longitude: store.longitude ?? null,
                reviewUrl: placeId.startsWith("ChI")
                    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`
                    : null,
            };
        });

        return NextResponse.json({ locations });
    } catch (err) {
        console.error("[/api/shop-review-links] Failed to fetch stores:", err);
        return NextResponse.json(
            { error: "Failed to fetch store list" },
            { status: 500 }
        );
    }
}
