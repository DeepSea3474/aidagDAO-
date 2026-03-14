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
      {/* 1. ANA SAYFA: Sitenin orijinal giriş sayfası */}
      <Route path="/" component={Home} />
      
      {/* 2. DASHBOARD: Yeni yaptığımız SoulwareAI sayfası */}
      <Route path="/dashboard" component={Dashboard} />
      
      {/* 3. MAINNET: Ağ takip sayfası */}
      <Route path="/mainnet" component={Mainnet} />
      
      {/* Hata durumunda boş ekran yerine uyarı ver */}
      <Route component={() => <div className="min-h-screen bg-black text-white flex items-center justify-center">404 - Sayfa Bulunamadı</div>} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}
