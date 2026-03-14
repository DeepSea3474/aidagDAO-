import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import Mainnet from "@/pages/Mainnet";
import Home from "@/pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/mainnet" component={Mainnet} />
      {/* Hatalı bir link girilirse ana sayfaya dönsün */}
      <Route component={Home} />
    </Switch>
  );
}

export default function App() {
  return (
    <Query

# 1. Navigation dosyasını en stabil hale getirelim
cat << 'EOF' > client/src/components/Navigation.tsx
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-white/5 bg-black sticky top-0 z-50 h-16 flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white font-bold text-xl">aidag</span>
            <span className="text-cyan-400 font-bold text-xl drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">DAO</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/"><a className={cn("text-sm font-medium", location === "/" ? "text-white" : "text-gray-500")}>Ana Sayfa</a></Link>
            <Link href="/dashboard"><a className={cn("text-sm font-medium", location === "/dashboard" ? "text-white" : "text-gray-500")}>Dashboard</a></Link>
          </div>
        </div>
        <Link href="/mainnet">
          <a className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-3 py-1 rounded-full font-bold">MAINNET</a>
        </Link>
      </div>
    </nav>
  );
}
