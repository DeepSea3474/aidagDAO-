import { MessageSquare, Send } from "lucide-react";

export default function SoulwareChat() {
  return (
    <div className="flex flex-col h-[500px] rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm uppercase tracking-wider">SoulwareAI Terminal</span>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="bg-primary/10 rounded-2xl p-3 max-w-[80%] self-start border border-primary/20">
          <p className="text-xs text-primary font-bold mb-1">SYSTEM</p>
          <p className="text-sm">Mainnet aktif. SoulwareAI operasyonları izleniyor. Size nasıl yardımcı olabilirim?</p>
        </div>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Sistem komutu girin..." 
            className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all"
          />
          <Send className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
