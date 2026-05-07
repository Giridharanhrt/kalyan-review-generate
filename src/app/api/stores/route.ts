import { NextResponse } from "next/server"

export async function GET() {
    const webhookUrl = process.env.STORES_WEBHOOK_URL
    const tenantId = process.env.X_TENANT_ID

    if (!webhookUrl) {
        return NextResponse.json(
            { error: "STORES_WEBHOOK_URL is not configured" },
            { status: 500 }
        )
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "GET",
            headers: {
                "X-tenant-id": tenantId ?? "",
            },
            // Disable Next.js data cache so we always get fresh store data
            cache: "no-store",
        })

        if (!response.ok) {
            const text = await response.text()
            return NextResponse.json(
                { error: `Upstream error: ${response.status}`, detail: text },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (err) {
        console.error("[/api/stores] Failed to fetch stores:", err)
        return NextResponse.json(
            { error: "Failed to fetch store list" },
            { status: 500 }
        )
    }
}
