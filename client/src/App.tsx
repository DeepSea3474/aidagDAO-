import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import Mainnet from "@/pages/Mainnet";
import Home from "@/pages/Home"; // Orijinal ana sayfan bu dosya

function Router() {
  return (
    <Switch>
      {/* Ana sayfan olduğu gibi kalıyor */}
      <Route path="/" component={Home} />
      {/* Yeni eklediğimiz sayfalar sadece kendi yollarında çalışacak */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/mainnet" component={Mainnet} />
      <Route component={() => <div>404 - Sayfa Bulunamadı</div>} />
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
