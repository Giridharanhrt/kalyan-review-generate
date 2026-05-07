"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BrandLogo } from "@/components/BrandLogo"

import {
    Building2,
    User,
    ShoppingBag,
    Star,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Loader2,
    CheckCircle2,
    RefreshCw,
    Share2,
    Brain,
    Zap,
    Target,
    Heart,
    Award,
    Smartphone,
    ThumbsUp,
    Lightbulb,
    Wand2,
    Sparkle,
    Bot,
    Check,
    Calendar,
    Copy,
    ClipboardCheck,
    ChevronDown,
    Search,
    MapPin
} from "lucide-react"

// Country codes with flags
const COUNTRY_CODES = [
    { code: "+91", flag: "\u{1F1EE}\u{1F1F3}", name: "India", short: "IN" },
    { code: "+1", flag: "\u{1F1FA}\u{1F1F8}", name: "United States", short: "US" },
    { code: "+44", flag: "\u{1F1EC}\u{1F1E7}", name: "United Kingdom", short: "GB" },
    { code: "+971", flag: "\u{1F1E6}\u{1F1EA}", name: "UAE", short: "AE" },
    { code: "+966", flag: "\u{1F1F8}\u{1F1E6}", name: "Saudi Arabia", short: "SA" },
    { code: "+65", flag: "\u{1F1F8}\u{1F1EC}", name: "Singapore", short: "SG" },
    { code: "+60", flag: "\u{1F1F2}\u{1F1FE}", name: "Malaysia", short: "MY" },
    { code: "+61", flag: "\u{1F1E6}\u{1F1FA}", name: "Australia", short: "AU" },
    { code: "+49", flag: "\u{1F1E9}\u{1F1EA}", name: "Germany", short: "DE" },
    { code: "+33", flag: "\u{1F1EB}\u{1F1F7}", name: "France", short: "FR" },
    { code: "+81", flag: "\u{1F1EF}\u{1F1F5}", name: "Japan", short: "JP" },
    { code: "+86", flag: "\u{1F1E8}\u{1F1F3}", name: "China", short: "CN" },
    { code: "+82", flag: "\u{1F1F0}\u{1F1F7}", name: "South Korea", short: "KR" },
    { code: "+62", flag: "\u{1F1EE}\u{1F1E9}", name: "Indonesia", short: "ID" },
    { code: "+63", flag: "\u{1F1F5}\u{1F1ED}", name: "Philippines", short: "PH" },
    { code: "+94", flag: "\u{1F1F1}\u{1F1F0}", name: "Sri Lanka", short: "LK" },
    { code: "+977", flag: "\u{1F1F3}\u{1F1F5}", name: "Nepal", short: "NP" },
    { code: "+880", flag: "\u{1F1E7}\u{1F1E9}", name: "Bangladesh", short: "BD" },
    { code: "+92", flag: "\u{1F1F5}\u{1F1F0}", name: "Pakistan", short: "PK" },
    { code: "+27", flag: "\u{1F1FF}\u{1F1E6}", name: "South Africa", short: "ZA" },
    { code: "+234", flag: "\u{1F1F3}\u{1F1EC}", name: "Nigeria", short: "NG" },
    { code: "+254", flag: "\u{1F1F0}\u{1F1EA}", name: "Kenya", short: "KE" },
    { code: "+55", flag: "\u{1F1E7}\u{1F1F7}", name: "Brazil", short: "BR" },
    { code: "+52", flag: "\u{1F1F2}\u{1F1FD}", name: "Mexico", short: "MX" },
    { code: "+7", flag: "\u{1F1F7}\u{1F1FA}", name: "Russia", short: "RU" },
    { code: "+39", flag: "\u{1F1EE}\u{1F1F9}", name: "Italy", short: "IT" },
    { code: "+34", flag: "\u{1F1EA}\u{1F1F8}", name: "Spain", short: "ES" },
    { code: "+31", flag: "\u{1F1F3}\u{1F1F1}", name: "Netherlands", short: "NL" },
    { code: "+46", flag: "\u{1F1F8}\u{1F1EA}", name: "Sweden", short: "SE" },
    { code: "+41", flag: "\u{1F1E8}\u{1F1ED}", name: "Switzerland", short: "CH" },
]

function PhoneInput({
    value,
    onChange,
}: {
    value: string
    onChange: (value: string) => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")

    // Parse existing value to extract country code and number
    const getSelectedCountry = () => {
        for (const country of COUNTRY_CODES) {
            if (value.startsWith(country.code)) {
                return country
            }
        }
        return COUNTRY_CODES[0] // Default India
    }

    const selectedCountry = getSelectedCountry()
    const phoneNumber = value.startsWith(selectedCountry.code)
        ? value.slice(selectedCountry.code.length).trim()
        : value.replace(/^\+\d+\s*/, '')

    const handleCountrySelect = (country: typeof COUNTRY_CODES[0]) => {
        onChange(`${country.code}${phoneNumber}`)
        setIsOpen(false)
        setSearch("")
    }

    const handleNumberChange = (num: string) => {
        // Only allow digits and spaces
        const cleaned = num.replace(/[^\d\s]/g, '')
        onChange(`${selectedCountry.code}${cleaned}`)
    }

    const filteredCountries = search
        ? COUNTRY_CODES.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.includes(search) ||
            c.short.toLowerCase().includes(search.toLowerCase())
        )
        : COUNTRY_CODES

    return (
        <div className="relative">
            <div className="flex h-11 rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                {/* Country selector */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 px-3 border-r border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                >
                    <span className="text-xl leading-none">{selectedCountry.flag}</span>
                    <span className="text-xs font-semibold text-gray-600">{selectedCountry.code}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Phone number input */}
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    placeholder="98765 43210"
                    className="flex-1 px-3 text-sm outline-none bg-transparent"
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setSearch("") }} />
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-black/15 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        {/* Search */}
                        <div className="p-2.5 border-b border-gray-100">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search country..."
                                className="w-full h-9 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:bg-white transition-all"
                                autoFocus
                            />
                        </div>
                        {/* Country list */}
                        <div className="max-h-70 overflow-y-auto custom-scrollbar">
                            {filteredCountries.map((country) => {
                                const isSelected = selectedCountry.code === country.code
                                return (
                                    <button
                                        key={country.short}
                                        type="button"
                                        onClick={() => handleCountrySelect(country)}
                                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${isSelected
                                            ? 'bg-blue-50'
                                            : 'hover:bg-gray-50 active:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-2xl leading-none">{country.flag}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                                                {country.name}
                                            </p>
                                        </div>
                                        <span className={`text-sm font-semibold shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {country.code}
                                        </span>
                                        {isSelected && (
                                            <Check className="w-4 h-4 text-blue-600 shrink-0" />
                                        )}
                                    </button>
                                )
                            })}
                            {filteredCountries.length === 0 && (
                                <p className="px-4 py-6 text-sm text-gray-400 text-center">No countries found</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

type ShopLocation = {
    _id: string
    storeId: string
    storeName: string
    locality?: string
    city?: string
    state?: string
    businessProfileId?: string
    latitude?: string
    longitude?: string
}

// Haversine formula — returns distance in km between two lat/lon points
function haversineKm(
    lat1: number, lon1: number,
    lat2: number, lon2: number
): number {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const NEARBY_RADIUS_KM = 10    // show stores within 10 km
const MAX_NEARBY_STORES = 20   // cap list at 20 nearest stores

// Step 1: Organization Schema
const orgSchema = z.object({
    orgName: z.string().default("Kalyan Jewellers"),
    orgType: z.string().default("Jewellery Store"),
    attenderName: z.string().min(2, "Attender name is required"),
    attenderId: z.string().min(1, "Attender ID is required"),
    attenderPhone: z.string().optional(),
    storeId: z.string().optional(),
    shopLocation: z.string().min(1, "Shop location is required"),
})

// Step 2: Customer & Purchase Schema with multi-select options
const customerSchema = z.object({
    customerName: z.string().min(2, "Customer name is required"),
    customerPhone: z.string().min(13, "Valid phone number required"),
    customerFrom: z.string().min(2, "Customer from is required"),
    purchaseType: z.string().min(2, "What was purchased is required"),
    satisfactionLevel: z.string().min(1).max(10),
    keyHighlights: z.string().optional(),
    improvementAreas: z.array(z.string()).default([]),
    recommendationLikelihood: z.string().min(1).max(10),
    // Event field with others option
    events: z.array(z.string()).default([]),
    eventOther: z.string().optional(),
    brandLoyalty: z.string().default(""),
    emotionalConnection: z.string().default(""),
})

type Step = 1 | 2 | 3

interface GeneratedReview {
    review: string
}

// Event options for multi-select with "Others" option
const EVENT_OPTIONS = [
    { value: "wedding", label: "Wedding", icon: "💒", color: "bg-pink-100 border-pink-300 text-pink-700" },
    { value: "engagement", label: "Engagement", icon: "💍", color: "bg-rose-100 border-rose-300 text-rose-700" },
    { value: "anniversary", label: "Anniversary", icon: "🎉", color: "bg-purple-100 border-purple-300 text-purple-700" },
    { value: "birthday", label: "Birthday", icon: "🎂", color: "bg-amber-100 border-amber-300 text-amber-700" },
    { value: "festival", label: "Festival (Diwali, etc.)", icon: "🪔", color: "bg-orange-100 border-orange-300 text-orange-700" },
    { value: "gift", label: "Gift", icon: "🎁", color: "bg-red-100 border-red-300 text-red-700" },
    { value: "investment", label: "Investment", icon: "📈", color: "bg-green-100 border-green-300 text-green-700" },
    { value: "daily_wear", label: "Daily Wear", icon: "✨", color: "bg-blue-100 border-blue-300 text-blue-700" },
    { value: "other", label: "Others", icon: "📝", color: "bg-gray-100 border-gray-300 text-gray-700" },
]

const IMPROVEMENT_AREA_OPTIONS = [
    { value: "waiting-time", label: "Waiting time was a bit long", icon: "⏳" },
    { value: "billing-speed", label: "Billing process could be faster", icon: "🧾" },
    { value: "design-variety", label: "Need more design variety in some categories", icon: "📿" },
    { value: "size-availability", label: "Preferred size/design was not immediately available", icon: "📏" },
    { value: "price-clarity", label: "Making charges and pricing could be explained more clearly", icon: "💬" },
    { value: "peak-hour-support", label: "More staff support during rush hours would help", icon: "👥" },
    { value: "delivery-followup", label: "Delivery/update follow-up can be more proactive", icon: "📦" },
    { value: "exchange-guidance", label: "Exchange/return policy explanation can be clearer", icon: "🔁" },
]

const BRAND_LOYALTY_OPTIONS = [
    { value: "new", label: "New Customer", description: "First purchase", icon: "🆕" },
    // { value: "occasional", label: "Occasional", description: "Buy sometimes", icon: "🌟" },
    { value: "regular", label: "Regular", description: "Consistent buyer", icon: "🔄" },
    // { value: "strong", label: "Strong Advocate", description: "Recommends to others", icon: "📢" },
    // { value: "loyal", label: "Lifelong Loyal", description: "Brand is part of them", icon: "💎" },
]

const EMOTIONAL_CONNECTION_OPTIONS = [
    { value: "Professional_Courteous_Helpful", label: "Professional, Courteous, & Helpful", description: "Brand is identity", icon: "🔥" },
    // { value: "strong", label: "Connected", description: "Positive feelings", icon: "💖" },
    { value: "moderate", label: "Moderate", description: "Generally positive", icon: "🙂" },
    // { value: "neutral", label: "Neutral", description: "No strong feelings", icon: "😐" },
    // { value: "weak", label: "Detached", description: "Little connection", icon: "🌊" },
]

function StepIndicator({ currentStep }: { currentStep: Step }) {
    const steps = [
        { icon: Building2, label: "Business" },
        { icon: User, label: "Customer" },
        { icon: Sparkles, label: "Review" },
    ]

    return (
        <div className="px-6 py-6 bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50 border-b border-indigo-100">
            <div className="flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2 mx-8" />
                <div
                    className="absolute top-1/2 left-0 h-1 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full -translate-y-1/2 mx-8 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const stepNum = (index + 1) as Step
                    const isActive = currentStep === stepNum
                    const isCompleted = currentStep > stepNum
                    const Icon = step.icon

                    return (
                        <div key={stepNum} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
                                ${isActive
                                    ? 'bg-linear-to-br from-violet-500 to-fuchsia-600 text-white shadow-violet-500/40 scale-110'
                                    : isCompleted
                                        ? 'bg-linear-to-br from-green-400 to-emerald-500 text-white shadow-green-500/40'
                                        : 'bg-white text-gray-400 shadow-gray-200'
                                }
                            `}>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`
                                text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300
                                ${isActive ? 'text-violet-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                            `}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function PremiumBadge() {
    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-violet-100 to-fuchsia-100 rounded-full border border-violet-200">
            <Sparkle className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Premium</span>
        </div>
    )
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
    return (
        <div className="px-5 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-800">{title}</h3>
                    {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
            </div>
        </div>
    )
}

function RatingSlider({
    value,
    onChange,
    label,
    icon: Icon
}: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    icon?: React.ElementType;
}) {
    const numValue = parseInt(value) || 5

    return (
        <div className="space-y-3 p-4 bg-linear-to-br from-gray-50/50 to-white rounded-xl border border-gray-100">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-violet-500" />}
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                        {numValue}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">/10</span>
                </div>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={numValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #d946ef ${(numValue - 1) * 11.11}%, #e5e7eb ${(numValue - 1) * 11.11}%, #e5e7eb 100%)`
                    }}
                />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                <span>Poor</span>
                <span>Excellent</span>
            </div>
        </div>
    )
}

// Multi-select component for events with "Others" option
function MultiSelectEventsWithOther({
    value,
    onChange,
    otherValue,
    onOtherChange
}: {
    value: string[];
    onChange: (value: string[]) => void;
    otherValue: string;
    onOtherChange: (value: string) => void;
}) {
    const toggleOption = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter(v => v !== optionValue))
        } else {
            onChange([...value, optionValue])
        }
    }

    const isOtherSelected = value.includes("other")

    return (
        <div className="space-y-3">
            <p className="text-xs text-gray-500">Select all that apply (tap to select/deselect)</p>
            <div className="grid grid-cols-2 gap-2">
                {EVENT_OPTIONS.map((option) => {
                    const isSelected = value.includes(option.value)
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleOption(option.value)}
                            className={`
                                relative p-3 rounded-xl border-2 transition-all duration-200 text-left
                                ${isSelected
                                    ? option.color + ' border-current shadow-md scale-[0.98]'
                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-lg">{option.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold ${isSelected ? 'text-current' : 'text-gray-700'}`}>
                                        {option.label}
                                    </p>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-current rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Show input when "Others" is selected */}
            {isOtherSelected && (
                <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 animate-in slide-in-from-top-2">
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Please specify the event:
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter custom event..."
                        value={otherValue}
                        onChange={(e) => onOtherChange(e.target.value)}
                        className="h-10 text-sm border-gray-300 rounded-lg focus:border-violet-500 focus:ring-violet-500/20"
                    />
                </div>
            )}
        </div>
    )
}

function MultiSelectImprovementAreas({
    value,
    onChange,
}: {
    value: string[];
    onChange: (value: string[]) => void;
}) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOption = (optionLabel: string) => {
        if (value.includes(optionLabel)) {
            onChange(value.filter((item) => item !== optionLabel))
        } else {
            onChange([...value, optionLabel])
        }
    }

    return (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full px-3.5 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="text-left">
                    <p className="text-xs font-semibold text-gray-700">Choose all that apply</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                        {value.length > 0 ? `${value.length} selected` : "No items selected"}
                    </p>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {value.length > 0 && !isOpen && (
                <div className="px-3.5 py-2.5 border-t border-gray-100 flex flex-wrap gap-1.5">
                    {value.map((item) => (
                        <span
                            key={item}
                            className="inline-flex items-center px-2 py-1 rounded-md text-[11px] bg-amber-100 text-amber-800"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            )}

            {isOpen && (
                <div className="p-3 border-t border-gray-100 grid grid-cols-1 gap-2">
                    {IMPROVEMENT_AREA_OPTIONS.map((option) => {
                        const isSelected = value.includes(option.label)
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => toggleOption(option.label)}
                                className={`
                                    relative p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 text-left
                                    ${isSelected
                                        ? "bg-amber-50 border-amber-400 shadow-sm"
                                        : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <span className="text-xl">{option.icon}</span>
                                <span className={`text-sm ${isSelected ? "text-amber-800 font-medium" : "text-gray-700"}`}>
                                    {option.label}
                                </span>
                                {isSelected && (
                                    <div className="ml-auto w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

// Single-select card component
function SelectCard({
    options,
    value,
    onChange,
    showDescription = true
}: {
    options: { value: string; label: string; description?: string; icon: string }[];
    value: string;
    onChange: (value: string) => void;
    showDescription?: boolean;
}) {
    return (
        <div className="grid grid-cols-1 gap-2">
            {options.map((option) => {
                const isSelected = value === option.value
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`
                            relative p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3
                            ${isSelected
                                ? 'bg-linear-to-r from-violet-50 to-fuchsia-50 border-violet-500 shadow-md'
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
                        `}
                    >
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1 text-left">
                            <p className={`text-sm font-semibold ${isSelected ? 'text-violet-700' : 'text-gray-700'}`}>
                                {option.label}
                            </p>
                            {showDescription && option.description && (
                                <p className={`text-xs ${isSelected ? 'text-violet-500' : 'text-gray-500'}`}>
                                    {option.description}
                                </p>
                            )}
                        </div>
                        {isSelected && (
                            <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

interface FormData {
    orgName?: string;
    orgType?: string;
    attenderName?: string;
    attenderId?: string;
    attenderPhone?: string;
    storeId?: string;
    shopLocation?: string;
    customerName?: string;
    customerPhone?: string;
    customerFrom?: string;
    purchaseType?: string;
    satisfactionLevel?: string;
    keyHighlights?: string;
    improvementAreas?: string;
    recommendationLikelihood?: string;
    events?: string[];
    eventOther?: string;
    brandLoyalty?: string;
    emotionalConnection?: string;
}

const STAFF_NAME_STORAGE_KEY = "kalyan_review_staff_name"
const STAFF_ID_STORAGE_KEY = "kalyan_review_staff_id"
const STAFF_PHONE_STORAGE_KEY = "kalyan_review_staff_phone"
const STORE_ID_STORAGE_KEY = "kalyan_review_store_id"
const SHOP_LOCATION_STORAGE_KEY = "kalyan_review_shop_location"
const DEFAULT_ORG_NAME = "Kalyan Jewellers"
const DEFAULT_ORG_TYPE = "Jewellery Store"

export function ReviewForm() {
    const [currentStep, setCurrentStep] = useState<Step>(1)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedReview, setGeneratedReview] = useState<GeneratedReview | null>(null)
    const [formData, setFormData] = useState<FormData>({})
    const [savedReviewId, setSavedReviewId] = useState<string | null>(null)
    const [regenerateModalOpen, setRegenerateModalOpen] = useState(false)
    const [improvementHint, setImprovementHint] = useState("")
    const [regeneratingTarget, setRegeneratingTarget] = useState<"review" | null>(null)
    const [copiedReview, setCopiedReview] = useState(false)
    const [smartLink, setSmartLink] = useState<string | null>(null)
    const [isCreatingLink, setIsCreatingLink] = useState(false)
    const [locationSearch, setLocationSearch] = useState("")
    const [shopLocations, setShopLocations] = useState<ShopLocation[]>([])
    const [locationsLoading, setLocationsLoading] = useState(false)
    const [locationsError, setLocationsError] = useState<string | null>(null)
    const [customerCoords, setCustomerCoords] = useState<{ lat: number; lon: number } | null>(null)
    const [geoError, setGeoError] = useState<string | null>(null)

    const orgForm = useForm<z.infer<typeof orgSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(orgSchema as any),
        defaultValues: {
            orgName: DEFAULT_ORG_NAME,
            orgType: DEFAULT_ORG_TYPE,
            attenderName: "",
            attenderId: "",
            attenderPhone: "",
            storeId: "",
            shopLocation: "",
        },
    })

    const customerForm = useForm<z.infer<typeof customerSchema>>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(customerSchema as any),
        defaultValues: {
            customerName: "",
            customerPhone: "+91",
            customerFrom: "",
            purchaseType: "",
            satisfactionLevel: "8",
            keyHighlights: "",
            improvementAreas: [],
            recommendationLikelihood: "9",
            events: [],
            eventOther: "",
            brandLoyalty: "",
            emotionalConnection: "",
        },
    })

    const onOrgSubmit = (values: z.infer<typeof orgSchema>) => {
        localStorage.setItem(STAFF_NAME_STORAGE_KEY, values.attenderName)
        localStorage.setItem(STAFF_ID_STORAGE_KEY, values.attenderId)
        localStorage.setItem(STAFF_PHONE_STORAGE_KEY, values.attenderPhone || "")
        localStorage.setItem(STORE_ID_STORAGE_KEY, values.storeId || "")
        localStorage.setItem(SHOP_LOCATION_STORAGE_KEY, values.shopLocation)
        setFormData((prev: FormData) => ({ ...prev, ...values }))
        setCurrentStep(2)
    }

    // Fetch customer's current GPS coordinates on mount
    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError("Geolocation not supported")
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCustomerCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
            },
            (err) => {
                console.warn("[ReviewForm] Geolocation error:", err.message)
                setGeoError(err.message)
            },
            { timeout: 8000, maximumAge: 60_000 }
        )
    }, [])

    // Fetch store list dynamically from the API proxy
    useEffect(() => {
        const fetchStores = async () => {
            setLocationsLoading(true)
            setLocationsError(null)
            try {
                const res = await fetch("/api/stores")
                if (!res.ok) throw new Error(`Failed to load stores (${res.status})`)
                const json = await res.json()
                // API returns { data: [...], message: "..." }
                const list: ShopLocation[] = Array.isArray(json) ? json : (json.data ?? [])
                setShopLocations(list)
            } catch (err) {
                console.error("[ReviewForm] fetchStores error:", err)
                setLocationsError("Could not load store list. Please try again.")
            } finally {
                setLocationsLoading(false)
            }
        }
        fetchStores()
    }, [])

    useEffect(() => {
        const savedAttenderName = localStorage.getItem(STAFF_NAME_STORAGE_KEY)?.trim() || ""
        const savedAttenderId = localStorage.getItem(STAFF_ID_STORAGE_KEY)?.trim() || ""
        const savedAttenderPhone = localStorage.getItem(STAFF_PHONE_STORAGE_KEY) || ""
        const savedStoreId = localStorage.getItem(STORE_ID_STORAGE_KEY)?.trim() || ""
        const savedShopLocation = localStorage.getItem(SHOP_LOCATION_STORAGE_KEY)?.trim() || ""
        if (!savedAttenderName || !savedAttenderId || !savedShopLocation) return

        orgForm.reset({
            orgName: DEFAULT_ORG_NAME,
            orgType: DEFAULT_ORG_TYPE,
            attenderName: savedAttenderName,
            attenderId: savedAttenderId,
            attenderPhone: savedAttenderPhone,
            storeId: savedStoreId,
            shopLocation: savedShopLocation,
        })

        setFormData((prev: FormData) => ({
            ...prev,
            orgName: DEFAULT_ORG_NAME,
            orgType: DEFAULT_ORG_TYPE,
            attenderName: savedAttenderName,
            attenderId: savedAttenderId,
            attenderPhone: savedAttenderPhone,
            storeId: savedStoreId,
            shopLocation: savedShopLocation,
        }))
        setCurrentStep(2)
    }, [orgForm])

    const onCustomerSubmit = async (values: z.infer<typeof customerSchema>) => {
        const fullData = {
            ...formData,
            ...values,
            improvementAreas: values.improvementAreas.length > 0 ? values.improvementAreas.join(", ") : "",
        }
        setFormData(fullData)
        setIsGenerating(true)

        try {
            const response = await fetch("/api/generate-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fullData),
            })

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}))
                throw new Error(errorBody.error || "Failed to generate review")
            }

            const data = await response.json()

            setGeneratedReview({ review: data.review })
            setCurrentStep(3)
        } catch (error) {
            console.error(error)
            customerForm.setError("root", {
                type: "manual",
                message: "Failed to generate review. Please try again.",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const saveReviewToDB = async (reviewText: string) => {
        if (savedReviewId) return
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, reviewText }),
            })
            if (res.ok) {
                const { id } = await res.json()
                setSavedReviewId(id)
            }
        } catch (e) {
            console.error("Save review failed:", e)
        }
    }

    const openRegenerateModal = useCallback(() => {
        setImprovementHint("")
        setRegenerateModalOpen(true)
    }, [])

    const handleRegenerate = async () => {
        setRegenerateModalOpen(false)
        setRegeneratingTarget("review")
        setIsGenerating(true)
        try {
            const response = await fetch("/api/generate-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    improvementHint: improvementHint || undefined,
                }),
            })

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}))
                throw new Error(errorBody.error || "Failed to regenerate")
            }

            const data = await response.json()
            setGeneratedReview({ review: data.review })
            setSmartLink(null)
        } catch (error) {
            console.error(error)
        } finally {
            setIsGenerating(false)
            setRegeneratingTarget(null)
        }
    }

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step)
        }
    }

    const resetForm = () => {
        const savedAttenderName = localStorage.getItem(STAFF_NAME_STORAGE_KEY)?.trim() || ""
        const savedAttenderId = localStorage.getItem(STAFF_ID_STORAGE_KEY)?.trim() || ""
        const savedAttenderPhone = localStorage.getItem(STAFF_PHONE_STORAGE_KEY) || ""
        const savedStoreId = localStorage.getItem(STORE_ID_STORAGE_KEY)?.trim() || ""
        const savedShopLocation = localStorage.getItem(SHOP_LOCATION_STORAGE_KEY)?.trim() || ""
        const hasSavedBusinessProfile = Boolean(savedAttenderName && savedAttenderId && savedShopLocation)

        setCurrentStep(hasSavedBusinessProfile ? 2 : 1)
        setGeneratedReview(null)
        setFormData(
            hasSavedBusinessProfile
                ? {
                    orgName: DEFAULT_ORG_NAME,
                    orgType: DEFAULT_ORG_TYPE,
                    attenderName: savedAttenderName,
                    attenderId: savedAttenderId,
                    attenderPhone: savedAttenderPhone,
                    storeId: savedStoreId,
                    shopLocation: savedShopLocation,
                }
                : {}
        )
        setSmartLink(null)
        setSavedReviewId(null)
        orgForm.reset({
            orgName: DEFAULT_ORG_NAME,
            orgType: DEFAULT_ORG_TYPE,
            attenderName: savedAttenderName,
            attenderId: savedAttenderId,
            attenderPhone: savedAttenderPhone,
            storeId: savedStoreId,
            shopLocation: savedShopLocation,
        })
        customerForm.reset()
    }

    const createSmartLink = async () => {
        if (!generatedReview) return
        setIsCreatingLink(true)
        try {
            await saveReviewToDB(generatedReview.review)

            const selectedLocation = shopLocations.find(loc => loc.storeId === formData.shopLocation)
            const placeTarget = selectedLocation?.businessProfileId || ""

            const response = await fetch("/api/shortlink", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reviewText: generatedReview.review,
                    customerName: formData.customerName || "Customer",
                    shopName: "Kalyan Jewellers",
                    placeId: placeTarget,
                }),
            })

            if (!response.ok) {
                const err = await response.json().catch(() => null)
                throw new Error(err?.error || "Failed to create link")
            }
            const data = await response.json()
            setSmartLink(data.url)

            // Build WhatsApp message with smart link
            const whatsappMessage = `Hi ${formData.customerName || ""}! Thank you for visiting Kalyan Jewellers! We'd love a quick Google review from you. Tap here - your review is ready, just paste it!\n\n${data.url}`
            const whatsappPhone = (formData.customerPhone || "").replace(/\D/g, "")
            const whatsappUrl = whatsappPhone
                ? `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(whatsappMessage)}`
                : `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`

            // iPhone Safari commonly blocks window.open after async work; direct navigation is more reliable.
            window.location.href = whatsappUrl
        } catch (error) {
            console.error(error)
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            setIsCreatingLink(false)
        }
    }

    // Step 1: Organization Information
    if (currentStep === 1) {
        return (
            <div className="form-container" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                <StepIndicator currentStep={currentStep} />

                <Form {...orgForm}>
                    <form onSubmit={orgForm.handleSubmit(onOrgSubmit)} className="divide-y divide-gray-100">
                        {/* Fixed Business Name */}
                        <div className="px-5 py-4 bg-linear-to-r from-violet-50 to-fuchsia-50 border-b border-violet-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-violet-100">
                                    <BrandLogo size={40} className="rounded-lg" />
                                </div>
                                <div>
                                    <p className="text-xs text-violet-600 font-medium uppercase tracking-wider">Business</p>
                                    <h3 className="text-lg font-bold text-gray-800">Kalyan Jewellers</h3>
                                    <p className="text-xs text-gray-500">Premium Jewellery Store</p>
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={orgForm.control}
                            name="attenderName"
                            render={({ field }) => (
                                <FormItem className="px-5 py-4 space-y-2 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-4 h-4 text-violet-500" />
                                        <FormLabel className="text-sm font-semibold text-gray-700">Attender Name *</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your name (salesperson/attender)"
                                            className="h-11 text-sm border-gray-200 rounded-xl focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={orgForm.control}
                            name="attenderId"
                            render={({ field }) => (
                                <FormItem className="px-5 py-4 space-y-2 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ClipboardCheck className="w-4 h-4 text-violet-500" />
                                        <FormLabel className="text-sm font-semibold text-gray-700">Attender ID *</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter attender ID (e.g., KJ-1023)"
                                            className="h-11 text-sm border-gray-200 rounded-xl focus:border-violet-500 focus:ring-violet-500/20 transition-all"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={orgForm.control}
                            name="attenderPhone"
                            render={({ field }) => (
                                <FormItem className="px-5 py-4 space-y-2 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Smartphone className="w-4 h-4 text-violet-500" />
                                        <FormLabel className="text-sm font-semibold text-gray-700">
                                            Attender Phone <span className="text-gray-400 font-normal">(Optional)</span>
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <PhoneInput
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={orgForm.control}
                            name="shopLocation"
                            render={({ field }) => {
                                // ── Proximity filtering ──────────────────────────────────────
                                // If we have the customer's GPS coords, compute distance to every
                                // store that has lat/lon and keep only those within the radius.
                                // Stores without coordinates are excluded when coords are available.
                                type StoreWithDist = ShopLocation & { distKm?: number }

                                let proximityStores: StoreWithDist[]
                                if (customerCoords) {
                                    proximityStores = shopLocations
                                        .filter(loc => loc.latitude && loc.longitude)
                                        .map(loc => ({
                                            ...loc,
                                            distKm: haversineKm(
                                                customerCoords.lat, customerCoords.lon,
                                                parseFloat(loc.latitude!),
                                                parseFloat(loc.longitude!)
                                            )
                                        }))
                                        .filter(loc => loc.distKm! <= NEARBY_RADIUS_KM)
                                        .sort((a, b) => a.distKm! - b.distKm!)
                                        .slice(0, MAX_NEARBY_STORES)
                                } else {
                                    // Fallback: show all stores (geolocation denied / unavailable)
                                    proximityStores = shopLocations
                                }

                                // ── Search filter on top of proximity list ───────────────────
                                const q = locationSearch.toLowerCase()
                                const filteredLocations: StoreWithDist[] = locationSearch
                                    ? proximityStores.filter(loc =>
                                        loc.storeName.toLowerCase().includes(q) ||
                                        loc.storeId.toLowerCase().includes(q) ||
                                        (loc.city ?? "").toLowerCase().includes(q) ||
                                        (loc.state ?? "").toLowerCase().includes(q) ||
                                        (loc.locality ?? "").toLowerCase().includes(q)
                                    )
                                    : proximityStores

                                const isNearbyMode = Boolean(customerCoords)

                                return (
                                    <FormItem className="px-5 py-4 space-y-3 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target className="w-4 h-4 text-violet-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">Shop Location *</FormLabel>
                                            {isNearbyMode && (
                                                <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    Nearby stores
                                                </span>
                                            )}
                                        </div>

                                        {/* Proximity hint */}
                                        {isNearbyMode && filteredLocations.length > 0 && !locationSearch && (
                                            <p className="text-[11px] text-gray-400 -mt-1">
                                                Showing {filteredLocations.length} store{filteredLocations.length !== 1 ? 's' : ''} within {NEARBY_RADIUS_KM} km — sorted by distance
                                            </p>
                                        )}
                                        {!isNearbyMode && geoError && (
                                            <p className="text-[11px] text-amber-600 -mt-1">
                                                📍 Location access denied — showing all stores
                                            </p>
                                        )}

                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={locationSearch}
                                                onChange={(e) => setLocationSearch(e.target.value)}
                                                placeholder="Search by store, city, state or locality…"
                                                disabled={locationsLoading}
                                                className="w-full h-10 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-60"
                                            />
                                        </div>

                                        <FormControl>
                                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                                                {locationsLoading && (
                                                    <div className="flex items-center justify-center py-6 gap-2 text-sm text-gray-400">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Loading store locations…
                                                    </div>
                                                )}
                                                {locationsError && !locationsLoading && (
                                                    <div className="py-4 text-center">
                                                        <p className="text-sm text-red-500 mb-2">{locationsError}</p>
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                setLocationsLoading(true)
                                                                setLocationsError(null)
                                                                try {
                                                                    const res = await fetch("/api/stores")
                                                                    if (!res.ok) throw new Error()
                                                                    const json = await res.json()
                                                                    const list: ShopLocation[] = Array.isArray(json) ? json : (json.data ?? [])
                                                                    setShopLocations(list)
                                                                } catch {
                                                                    setLocationsError("Could not load store list. Please try again.")
                                                                } finally {
                                                                    setLocationsLoading(false)
                                                                }
                                                            }}
                                                            className="text-xs text-violet-600 underline"
                                                        >
                                                            Retry
                                                        </button>
                                                    </div>
                                                )}
                                                {!locationsLoading && !locationsError && filteredLocations.map((location) => {
                                                    const isSelected = field.value === location.storeId
                                                    const distLabel = location.distKm !== undefined
                                                        ? location.distKm < 1
                                                            ? `${Math.round(location.distKm * 1000)} m`
                                                            : `${location.distKm.toFixed(1)} km`
                                                        : null
                                                    return (
                                                        <button
                                                            key={location.storeId}
                                                            type="button"
                                                            onClick={() => {
                                                                field.onChange(location.storeId)
                                                                orgForm.setValue("storeId", location.storeId)
                                                                setLocationSearch("")
                                                            }}
                                                            className={`
                                                                relative p-3 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer
                                                                ${isSelected
                                                                    ? 'bg-linear-to-r from-violet-50 to-fuchsia-50 border-violet-500 shadow-md'
                                                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm font-semibold ${isSelected ? 'text-violet-700' : 'text-gray-700'}`}>
                                                                        {location.storeName}
                                                                        <span className={`ml-2 text-xs font-normal ${isSelected ? 'text-violet-400' : 'text-gray-400'}`}>({location.storeId})</span>
                                                                    </p>
                                                                    {(location.locality || location.city || location.state) && (
                                                                        <p className={`text-xs ${isSelected ? 'text-violet-500' : 'text-gray-500'}`}>
                                                                            {[location.locality, location.city, location.state].filter(Boolean).join(", ")}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    {distLabel && (
                                                                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isSelected
                                                                            ? 'bg-violet-100 text-violet-600'
                                                                            : 'bg-green-50 text-green-600 border border-green-200'
                                                                            }`}>
                                                                            <MapPin className="w-2.5 h-2.5" />
                                                                            {distLabel}
                                                                        </span>
                                                                    )}
                                                                    {isSelected && (
                                                                        <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                                                            <Check className="w-3 h-3 text-white" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                                {!locationsLoading && !locationsError && filteredLocations.length === 0 && (
                                                    <p className="py-4 text-sm text-gray-400 text-center">
                                                        {isNearbyMode && !locationSearch
                                                            ? "No stores found within " + NEARBY_RADIUS_KM + " km of your location"
                                                            : "No locations found"
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )
                            }}
                        />

                        <div className="p-5 bg-linear-to-r from-gray-50 to-white border-t border-gray-100">
                            <Button
                                type="submit"
                                className="w-full h-12 text-sm font-bold bg-linear-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white rounded-xl shadow-lg shadow-violet-500/25 transition-all active:scale-[0.98] group"
                            >
                                Continue to Customer Info
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        )
    }

    // Step 2: Customer Information
    if (currentStep === 2) {
        return (
            <div className="form-container" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                <StepIndicator currentStep={currentStep} />

                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800">Customer Details</h2>
                        </div>
                    </div>
                    {/* <PremiumBadge /> */}
                </div>

                <Form {...customerForm}>
                    <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="custom-scrollbar" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                        <div className="px-5 py-4 space-y-4">
                            <FormField
                                control={customerForm.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">Customer Name</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter customer's full name"
                                                className="h-11 text-sm border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={customerForm.control}
                                name="customerPhone"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="w-4 h-4 text-blue-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">WhatsApp Number</FormLabel>
                                        </div>
                                        <FormControl>
                                            <PhoneInput
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={customerForm.control}
                                name="customerFrom"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-blue-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">Customer From</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., T. Nagar, Chennai"
                                                className="h-11 text-sm border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <SectionHeader
                            icon={ShoppingBag}
                            title="Purchase Details"
                            subtitle="Information about the purchase"
                        />

                        <div className="px-5 py-4 space-y-4">
                            <FormField
                                control={customerForm.control}
                                name="purchaseType"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <ShoppingBag className="w-4 h-4 text-emerald-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">What was purchased?</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Gold Necklace, Diamond Ring"
                                                className="h-11 text-sm border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={customerForm.control}
                                name="events"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">What&apos;s the occasion?</FormLabel>
                                        </div>
                                        <FormControl>
                                            <MultiSelectEventsWithOther
                                                value={field.value}
                                                onChange={field.onChange}
                                                otherValue={customerForm.watch("eventOther") || ""}
                                                onOtherChange={(value) => customerForm.setValue("eventOther", value)}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <SectionHeader
                            icon={Star}
                            title="Experience Ratings"
                            subtitle="Rate the customer experience"
                        />

                        <div className="px-5 py-4 space-y-4">
                            <FormField
                                control={customerForm.control}
                                name="satisfactionLevel"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <RatingSlider
                                                value={field.value}
                                                onChange={field.onChange}
                                                label="Overall Satisfaction"
                                                icon={ThumbsUp}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 mt-2" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={customerForm.control}
                                name="recommendationLikelihood"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <RatingSlider
                                                value={field.value}
                                                onChange={field.onChange}
                                                label="Likelihood to Recommend"
                                                icon={Heart}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500 mt-2" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="px-5 py-4 space-y-4">
                            <FormField
                                control={customerForm.control}
                                name="keyHighlights"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">Key Highlights <span className="text-gray-400 font-normal">(Optional)</span></FormLabel>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="What did the customer appreciate most? e.g., excellent service, product quality..."
                                                className="min-h-20 text-sm border-gray-200 rounded-xl focus:border-amber-500 focus:ring-amber-500/20 resize-none transition-all"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={customerForm.control}
                                name="improvementAreas"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Lightbulb className="w-4 h-4 text-amber-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">Areas for Improvement <span className="text-gray-400 font-normal">(Optional)</span></FormLabel>
                                        </div>
                                        <FormControl>
                                            <MultiSelectImprovementAreas
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <SectionHeader
                            icon={Brain}
                            title="Customer Psychology"
                            subtitle="Quick selections to capture customer relationship"
                        />

                        <div className="px-5 py-4 space-y-6 pb-6">
                            <FormField
                                control={customerForm.control}
                                name="brandLoyalty"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-rose-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">Customer Type</FormLabel>
                                        </div>
                                        <FormControl>
                                            <SelectCard
                                                options={BRAND_LOYALTY_OPTIONS}
                                                value={field.value}
                                                onChange={field.onChange}
                                                showDescription={true}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={customerForm.control}
                                name="emotionalConnection"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-rose-500" />
                                            <FormLabel className="text-sm font-semibold text-gray-700">Staff Behavior</FormLabel>
                                        </div>
                                        <FormControl>
                                            <SelectCard
                                                options={EMOTIONAL_CONNECTION_OPTIONS}
                                                value={field.value}
                                                onChange={field.onChange}
                                                showDescription={true}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-5 bg-linear-to-r from-gray-50 to-white border-t border-gray-200 space-y-3 sticky bottom-0">
                            {customerForm.formState.errors.root && (
                                <p className="text-xs text-red-500 text-center">{customerForm.formState.errors.root.message}</p>
                            )}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={goBack}
                                    className="flex-1 h-12 text-sm font-semibold rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all"
                                >
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isGenerating}
                                    className="flex-2 h-12 text-sm font-bold bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 hover:from-violet-600 hover:via-fuchsia-600 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-violet-500/30 transition-all active:scale-[0.98] group"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                                            Generate Review
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        )
    }

    // Step 3: Generated Review
    if (currentStep === 3 && generatedReview) {
        return (
            <div className="form-container" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                <StepIndicator currentStep={currentStep} />

                {/* Regenerate Modal */}
                <Dialog open={regenerateModalOpen} onOpenChange={setRegenerateModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-violet-600" />
                                Regenerate Review
                            </DialogTitle>
                            <DialogDescription>
                                What would you like to improve? Describe the changes and we&apos;ll regenerate.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-3">
                            <Textarea
                                placeholder="e.g., Make it shorter, mention gold purity, sound more casual..."
                                value={improvementHint}
                                onChange={(e) => setImprovementHint(e.target.value)}
                                className="min-h-25 text-sm border-gray-200 rounded-xl focus:border-violet-500 focus:ring-violet-500/20 resize-none"
                            />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setRegenerateModalOpen(false)}
                                className="rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRegenerate}
                                className="bg-linear-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white rounded-xl"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Header */}
                {/* <div className="px-5 py-4 bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">Generated Review</h2>
                            <p className="text-[11px] text-white/80">Auto-saved to database</p>
                        </div>
                    </div>
                </div> */}

                <div className="p-5 space-y-5">
                    {/* Generated Review */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Google Review</p>
                        <div className="relative bg-linear-to-br from-violet-50 via-fuchsia-50 to-pink-50 rounded-2xl p-5 border border-violet-200 shadow-inner overflow-hidden">
                            {regeneratingTarget === "review" && (
                                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
                                            <Sparkles className="w-5 h-5 text-violet-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        <p className="text-sm font-semibold text-violet-700">Regenerating review...</p>
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-violet-200/30 to-transparent animate-shimmer" />
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30 border border-violet-100">
                                    <BrandLogo size={32} className="rounded-md" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {generatedReview.review}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                            <Button
                                variant="outline"
                                onClick={() => openRegenerateModal()}
                                disabled={regeneratingTarget !== null}
                                className="flex-1 h-11 text-sm font-semibold rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-all cursor-pointer"
                            >
                                {regeneratingTarget === "review" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Regenerate
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    saveReviewToDB(generatedReview.review)
                                    navigator.clipboard.writeText(generatedReview.review)
                                    setCopiedReview(true)
                                    setTimeout(() => setCopiedReview(false), 2000)
                                }}
                                className="flex-1 h-11 text-sm font-semibold rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                {copiedReview ? (
                                    <span className="flex items-center gap-2 text-green-600 animate-in zoom-in-50 duration-300">
                                        <ClipboardCheck className="w-4 h-4" />
                                        Copied!
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Copy className="w-4 h-4" />
                                        Copy Review
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Send Smart Link via WhatsApp */}
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                                <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Send to Customer via WhatsApp</p>
                                <p className="text-[11px] text-gray-500">Creates a smart link: copies review + opens Google Reviews</p>
                            </div>
                        </div>
                        <Button
                            onClick={createSmartLink}
                            disabled={isCreatingLink}
                            className="w-full h-12 text-sm font-bold bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] cursor-pointer group"
                        >
                            {isCreatingLink ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating smart link...
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Send Review Link on WhatsApp
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                        {smartLink && (
                            <p className="text-xs text-green-700 mt-2 text-center font-medium">
                                Link created and sent!
                            </p>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetForm}
                        className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Start New Review
                    </Button>
                </div>
            </div>
        )
    }

    return null
}
