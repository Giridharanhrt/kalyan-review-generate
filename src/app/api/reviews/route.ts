import { NextResponse } from "next/server";

function getWebhookUrl(): string | null {
    const url = process.env.REVIEW_WEBHOOK_URL?.trim()
    if (!url) return null
    const secret = process.env.REVIEW_WEBHOOK_SECRET?.trim()
    if (!secret) return url
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}token=${secret}`
}

function getWebhookHeaders(): Record<string, string> {
    return {
        "Content-Type": "application/json",
        "X-tenant-id": "6707976e9684b2302feafbaa",
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customerName, purchaseType, reviewText } = body;

        if (!customerName || !purchaseType || !reviewText) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const webhookUrl = getWebhookUrl();
        if (!webhookUrl) {
            return NextResponse.json(
                { error: "Webhook not configured" },
                { status: 503 }
            );
        }

        const webhookRes = await fetch(webhookUrl, {
            method: "POST",
            headers: getWebhookHeaders(),
            body: JSON.stringify(body),
        });

        if (!webhookRes.ok) {
            const err = await webhookRes.json().catch(() => ({}));
            return NextResponse.json(
                { error: (err as { error?: string }).error || "Webhook error" },
                { status: webhookRes.status }
            );
        }

        const data = await webhookRes.json();
        return NextResponse.json({ success: true, id: data.id });
    } catch (error) {
        console.error("Save Review Error:", error);
        return NextResponse.json(
            { error: "Failed to save review" },
            { status: 500 }
        );
    }
}

