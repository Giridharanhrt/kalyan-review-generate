import { ReviewForm } from "@/components/ReviewForm";
import { BrandLogo } from "@/components/BrandLogo";
import { shopConfig } from "@/config/shop";
import { Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-fuchsia-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #fff 1px, transparent 1px),
              linear-gradient(to bottom, #fff 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-14 h-14 bg-white rounded-2xl p-1.5 flex items-center justify-center shadow-2xl shadow-black/30">
              <BrandLogo size={44} priority className="rounded-xl" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">{shopConfig.name}</h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-green-400 font-medium">Generator Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/30 overflow-hidden border border-white/20">
          <ReviewForm />
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-white/40">
            Review Generator v1.0 • Made with 
            <span className="text-red-400 mx-1">♥</span> 
            for {shopConfig.name}
          </p>
        </div>
      </div>
    </main>
  );
}
