import { NextResponse } from "next/server";
import { generateReview } from "@/lib/gemini";

// Kalyan Jewellers Shop Locations
const SHOP_LOCATIONS = [
    { value: "mumbai_mg_road", label: "Mumbai - M.G. Road" },
    { value: "mumbai_bandra", label: "Mumbai - Bandra West" },
    { value: "mumbai_andheri", label: "Mumbai - Andheri East" },
    { value: "pune_fc_road", label: "Pune - F.C. Road" },
    { value: "pune_camp", label: "Pune - Camp" },
    { value: "delhi_karol_bagh", label: "Delhi - Karol Bagh" },
    { value: "delhi_south_ext", label: "Delhi - South Extension" },
    { value: "bangalore_brigade", label: "Bangalore - Brigade Road" },
    { value: "bangalore_indiranagar", label: "Bangalore - Indiranagar" },
    { value: "hyderabad_banjara", label: "Hyderabad - Banjara Hills" },
    { value: "chennai_t_nagar", label: "Chennai - T. Nagar" },
    { value: "kolkata_park_st", label: "Kolkata - Park Street" },
] as const;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            orgName,
            orgType,
            attenderName,
            attenderId,
            shopLocation,
            customerName,
            customerPhone,
            customerFrom,
            purchaseType,
            satisfactionLevel,
            keyHighlights,
            improvementAreas,
            recommendationLikelihood,
            events,
            eventOther,
            brandLoyalty,
            emotionalConnection,
            improvementHint,
        } = body;

        if (!orgName || !orgType || !attenderName || !attenderId || !customerName || !purchaseType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let eventStr = "";
        if (Array.isArray(events) && events.length > 0) {
            const processedEvents = events.map(event => {
                if (event === "other" && eventOther) return eventOther;
                return event;
            });
            eventStr = processedEvents.join(", ");
        }

        const locationLabel = shopLocation ?
            SHOP_LOCATIONS.find(loc => loc.value === shopLocation)?.label || shopLocation
            : undefined;

        const result = await generateReview(
            {
                orgName,
                orgType,
                attenderName,
                attenderId,
                shopLocation: locationLabel,
                customerName,
                customerPhone,
                customerFrom,
                purchaseType,
                satisfactionLevel: parseInt(satisfactionLevel) || 8,
                keyHighlights,
                improvementAreas,
                recommendationLikelihood: parseInt(recommendationLikelihood) || 9,
                events: eventStr,
                brandLoyalty,
                emotionalConnection,
            },
            { improvementHint: improvementHint || undefined }
        );

        if (!result.success || !result.review) {
            return NextResponse.json(
                { error: result.error || "Failed to generate review" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            review: result.review,
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
