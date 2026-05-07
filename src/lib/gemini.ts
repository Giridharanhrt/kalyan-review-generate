import { GoogleGenerativeAI } from "@google/generative-ai";

interface ReviewGenerationInput {
  orgName: string;
  orgType: string;
  attenderName?: string;
  attenderId?: string;
  shopLocation?: string;

  customerName: string;
  customerPhone?: string;
  customerFrom?: string;

  purchaseType: string;

  satisfactionLevel: number;
  keyHighlights?: string;
  improvementAreas?: string;
  recommendationLikelihood: number;

  events?: string;

  brandLoyalty?: string;
  emotionalConnection?: string;
}

interface ReviewGenerationResult {
  success: boolean;
  review?: string;
  error?: string;
}

function sentenceCount(text: string): number {
  const matches = text.match(/[^.!?]+[.!?]+/g);
  return matches ? matches.length : 0;
}

function getSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+/g);
  return matches ? matches.map((s) => s.trim()) : [];
}

function hasCustomerFromInMiddle(text: string, customerFrom?: string): boolean {
  const from = customerFrom?.trim().toLowerCase();
  if (!from) return true;

  const sentences = getSentences(text);
  if (sentences.length < 3) return false;

  return [1, 2].some((idx) => (sentences[idx] || "").toLowerCase().includes(from));
}

function cleanReviewText(text: string): string {
  return text
    .replace(/[`*_#>-]/g, "")
    .replace(/^["']|["']$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreTone(satisfactionLevel: number, recommendationLikelihood: number): string {
  const combined = (satisfactionLevel + recommendationLikelihood) / 2;
  if (combined >= 9) return "highly delighted and enthusiastic";
  if (combined >= 7.5) return "warm, positive, and confident";
  if (combined >= 6) return "balanced, honest, and constructive";
  return "polite, realistic, and measured";
}

function getReviewClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured");
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function generateReview(
  input: ReviewGenerationInput,
  options?: { improvementHint?: string }
): Promise<ReviewGenerationResult> {
  try {
    const genAI = getReviewClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
      },
    });

    const prompt = buildReviewPrompt(input, options?.improvementHint);
    const result = await model.generateContent(prompt);
    let review = cleanReviewText((await result.response).text());

    // Repair pass when model misses exact sentence format or omits customer "from" in sentence 2/3.
    let attempts = 0;
    while (
      attempts < 2 &&
      (sentenceCount(review) !== 4 || !hasCustomerFromInMiddle(review, input.customerFrom))
    ) {
      const fromRule = input.customerFrom?.trim()
        ? ` Include the exact location text "${input.customerFrom}" in sentence 2 or 3 only (not sentence 1).`
        : "";

      const rewrite = await model.generateContent(
        `Rewrite this as EXACTLY 4 short natural sentences. Keep meaning same, plain text only.${fromRule}\n\n${review}`
      );
      review = cleanReviewText((await rewrite.response).text());
      attempts += 1;
    }

    return { success: true, review };
  } catch (error) {
    console.error("Review Generation Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate review",
    };
  }
}

function buildReviewPrompt(input: ReviewGenerationInput, improvementHint?: string): string {
  const toneCue = scoreTone(input.satisfactionLevel, input.recommendationLikelihood);

  return `Generate a short, authentic Google review for a jewellery store. The review must feel like a REAL person typed it on their phone — casual, warm, human.

BUSINESS:
- Name: ${input.orgName}
- Type: ${input.orgType}
${input.attenderName ? `- Served by: ${input.attenderName}` : ""}
${input.attenderId ? `- Attender ID: ${input.attenderId}` : ""}
${input.shopLocation ? `- Location: ${input.shopLocation}` : ""}

CUSTOMER:
- Name: ${input.customerName}
${input.customerFrom ? `- From: ${input.customerFrom}` : ""}
- Bought: ${input.purchaseType}

EXPERIENCE:
- Satisfaction: ${input.satisfactionLevel}/10
- Would recommend: ${input.recommendationLikelihood}/10
${input.events ? `- Occasion: ${input.events}` : ""}
${input.keyHighlights ? `- Highlights: ${input.keyHighlights}` : ""}
${input.improvementAreas ? `- Could improve: ${input.improvementAreas}` : ""}

${input.brandLoyalty ? `- Loyalty: ${input.brandLoyalty}` : ""}
${input.emotionalConnection ? `- Emotional connection: ${input.emotionalConnection}` : ""}
TARGET TONE:
- ${toneCue}
- Human, conversational, believable, specific.
- Sound like one customer sharing a genuine experience, not a marketing team.

STRICT RULES:
1. Write EXACTLY 4 short sentences. No more, no less.
2. First person as ${input.customerName}. Sound like a real human, not a copywriter.
3. Mention ${input.orgName} by name naturally.
4. Include at least one concrete detail (service behavior, design choice, feeling, or buying moment).
5. Include a natural price/value mention when it fits (e.g., fair price, affordable, worth the design/quality, good value for money).
6. Do NOT use any markdown, bullet points, stars, or formatting.
7. Do NOT use quotation marks around the review.
8. Do NOT add a greeting or sign-off.
9. Avoid generic filler phrases like "highly recommended" unless supported by details.
10. No fake claims, no discount offers or hard pricing promises; only personal value perception about pricing.
11. Write it like someone typing a quick Google review on their phone — natural, genuine, slightly imperfect.
12. Do NOT include suggestions or referrals to others (e.g., "I recommend", "you should visit", "check them out").
13. Mention where I am from naturally in sentence 2 or 3 only (not sentence 1), and keep it blended into the review flow.
14. ${input.customerFrom ? `You MUST include this exact from/location text once: "${input.customerFrom}".` : "If from/location is available, include it exactly once."}
${improvementHint ? `\nIMPORTANT ADJUSTMENT: "${improvementHint}"\n` : ""}
Generate the review now (plain text, 4 sentences only):`;
}

export function checkApiStatus(): {
  configured: boolean;
  message: string;
  instructions?: string[];
} {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return {
      configured: false,
      message: "API not configured",
      instructions: [
        "1. Get API key from https://makersuite.google.com/app/apikey",
        "2. Add GOOGLE_API_KEY=your_key to .env file",
      ],
    };
  }
  return { configured: true, message: "API is configured" };
}

const reviewService = { generateReview, checkApiStatus };
export default reviewService;
