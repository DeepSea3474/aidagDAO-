import { Link, useLocation } from "wouter";
import { LayoutDashboard, Home, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 shrink-0 cursor-pointer group">
            <img 
              src="/assets/aidag-logo_1770572833982-IJmwKujp.jpg" 
              alt="aidagDAO Logo" 
              className="h-10 w-10 rounded-full object-cover border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform"
            />
            <div className="flex items-baseline font-black text-2xl tracking-tighter italic">
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">aidag</span>
              <span className="bg-gradient-to-br from-[#00f2ff] via-[#0062ff] to-[#000000] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,242,255,0.4)] ml-0.5">DAO</span>
            </div>
          </Link>
          
          <div className="hidden md:flex gap-6">
            <Link href="/">
              <a className={cn(
                "flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white",
                location === "/" ? "text-white" : "text-gray-400"
              )}>
                <Home className="h-4 w-4" /> Ana Sayfa
              </a>
            </Link>
            <Link href="/dashboard">
              <a className={cn(
                "flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white",
                location === "/dashboard" ? "text-white" : "text-gray-400"
              )}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </a>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/mainnet">
            <a className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer",
              location === "/mainnet" 
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.2)]" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20"
            )}>
              <div className={cn("h-2 w-2 rounded-full bg-cyan-500", location !== "/mainnet" && "animate-pulse")} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-inherit">MAINNET</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
