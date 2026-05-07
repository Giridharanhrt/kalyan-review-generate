"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

export default function ReviewRedirectClient({
    reviewText,
    customerName,
    shopName,
    placeId,
}: {
    reviewText: string;
    customerName: string;
    shopName: string;
    placeId: string;
}) {
    const [copied, setCopied] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const [requiresManualCopy, setRequiresManualCopy] = useState(false);

    const hasPlaceId = placeId.startsWith("ChI");
    const encodedPlaceId = hasPlaceId ? encodeURIComponent(placeId) : "";
    const googleWriteReviewUrl = hasPlaceId
        ? `https://search.google.com/local/writereview?placeid=${encodedPlaceId}`
        : "";

    async function copyReviewToClipboard() {
        try {
            await navigator.clipboard.writeText(reviewText);
            setCopied(true);
            return true;
        } catch {
            // Fallback: select hidden textarea
            const textarea = document.getElementById("review-text") as HTMLTextAreaElement | null;
            if (textarea) {
                textarea.select();
                textarea.setSelectionRange(0, 99999);
                const didCopy = document.execCommand("copy");
                setCopied(didCopy);
                return didCopy;
            }
            return false;
        }
    }

    function redirectToReviewBox() {
        if (!hasPlaceId) return;
        setRedirecting(true);
        setTimeout(() => {
            window.location.href = googleWriteReviewUrl;
        }, 700);
    }

    async function handleCopyAndOpen() {
        await copyReviewToClipboard();
        if (hasPlaceId) redirectToReviewBox();
    }

    useEffect(() => {
        // No Google Place ID — just copy the review silently, no redirect
        if (!hasPlaceId) {
            copyReviewToClipboard();
            return;
        }

        const userAgent = navigator.userAgent || "";
        const isIPhone = /iPhone/i.test(userAgent);

        if (isIPhone) {
            setRequiresManualCopy(true);
            return;
        }

        handleCopyAndOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            }}
        >
            {/* Hidden textarea for fallback copy */}
            <textarea
                id="review-text"
                defaultValue={reviewText}
                style={{ position: "absolute", left: "-9999px" }}
                readOnly
            />

            <div
                style={{
                    background: "white",
                    borderRadius: "24px",
                    padding: "40px 30px",
                    maxWidth: "380px",
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                }}
            >
                {/* Logo/Icon */}
                <div
                    style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "20px",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}
                >
                    <BrandLogo size={56} priority className="rounded-[14px]" />
                </div>

                <h1
                    style={{
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#1f2937",
                        margin: "0 0 8px",
                    }}
                >
                    {copied ? "Review Copied!" : "Preparing your review..."}
                </h1>

                <p
                    style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        margin: "0 0 24px",
                        lineHeight: "1.5",
                    }}
                >
                    {redirecting
                        ? "Opening Google review box... Just tap Paste!"
                        : hasPlaceId
                            ? requiresManualCopy
                                ? `Thank you ${customerName}! Tap below to copy and open review for ${shopName}.`
                                : `Thank you ${customerName}! Copying your review for ${shopName}...`
                            : copied
                                ? `Review copied! Open Google Maps, search "${shopName}", and paste it in the review box.`
                                : `Thank you ${customerName}! Your review is ready — copy it below.`}
                </p>

                {/* Review preview */}
                <div
                    style={{
                        background: "#f9fafb",
                        borderRadius: "16px",
                        padding: "16px",
                        marginBottom: "24px",
                        textAlign: "left",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <p
                        style={{
                            fontSize: "13px",
                            color: "#374151",
                            lineHeight: "1.6",
                            margin: 0,
                        }}
                    >
                        {reviewText}
                    </p>
                </div>

                {/* Loading indicator */}
                {redirecting && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            marginBottom: "16px",
                        }}
                    >
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                border: "3px solid #e5e7eb",
                                borderTopColor: "#8b5cf6",
                                borderRadius: "50%",
                                animation: "spin 0.8s linear infinite",
                            }}
                        />
                        <span style={{ fontSize: "13px", color: "#8b5cf6", fontWeight: "600" }}>
                            Redirecting to Google Review box...
                        </span>
                    </div>
                )}

                {hasPlaceId ? (
                    requiresManualCopy ? (
                        <button
                            type="button"
                            onClick={handleCopyAndOpen}
                            style={{
                                display: "block",
                                width: "100%",
                                background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
                                color: "white",
                                padding: "14px 24px",
                                borderRadius: "14px",
                                border: "none",
                                fontWeight: "700",
                                fontSize: "15px",
                                boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)",
                                cursor: "pointer",
                            }}
                        >
                            Copy Review and Open Google Review Box
                        </button>
                    ) : (
                        <a
                            href={googleWriteReviewUrl}
                            style={{
                                display: "block",
                                background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
                                color: "white",
                                padding: "14px 24px",
                                borderRadius: "14px",
                                textDecoration: "none",
                                fontWeight: "700",
                                fontSize: "15px",
                                boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)",
                            }}
                        >
                            Open Google Review Box
                        </a>
                    )
                ) : (
                    // Copy-only mode — store has no Google Place ID configured yet
                    <button
                        type="button"
                        onClick={copyReviewToClipboard}
                        style={{
                            display: "block",
                            width: "100%",
                            background: copied
                                ? "linear-gradient(135deg, #10b981, #059669)"
                                : "linear-gradient(135deg, #8b5cf6, #d946ef)",
                            color: "white",
                            padding: "14px 24px",
                            borderRadius: "14px",
                            border: "none",
                            fontWeight: "700",
                            fontSize: "15px",
                            boxShadow: copied
                                ? "0 4px 14px rgba(16, 185, 129, 0.4)"
                                : "0 4px 14px rgba(139, 92, 246, 0.4)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {copied ? "✓ Review Copied!" : "Copy Review Text"}
                    </button>
                )}

                <p
                    style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        marginTop: "16px",
                    }}
                >
                    {hasPlaceId
                        ? "Review text is in your clipboard. Just long-press and paste!"
                        : "Copy the review above, open Google Maps, find this store, and paste it in the Reviews section."}
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
