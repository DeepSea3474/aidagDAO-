import { MessageSquare, Send, Bot } from "lucide-react";

export default function SoulwareChat() {
  return (
    <div className="flex flex-col h-[550px] rounded-[2.5rem] border border-white/5 bg-[#0d0d0d]/80 backdrop-blur-3xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-white/5 bg-gradient-to-r from-cyan-500/10 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20">
            <Bot className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">SoulwareAI Terminal</h3>
            <p className="text-[10px] text-emerald-500 font-medium animate-pulse">● LIVE OPERATIONAL</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <Bot className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="bg-white/5 rounded-2xl p-4 max-w-[85%] border border-white/5">
            <p className="text-sm text-gray-300 leading-relaxed">
              Selam Mimar. <span className="text-cyan-400 font-bold">aidagDAO Mainnet</span> operasyonları optimize ediliyor. Tüm madencilik düğümleri aktif. Sana nasıl yardımcı olabilirim?
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white/[0.02] border-t border-white/5">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Yapay zekaya komut gönder..." 
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all"
          />
          <button className="absolute right-2 p-2 bg-cyan-500 rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
            <Send className="h-4 w-4 text-black font-bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
