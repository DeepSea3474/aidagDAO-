export default function SoulwareChat() {
  return (
    <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-6 h-[500px] flex flex-col shadow-2xl">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">SoulwareAI Terminal</h3>
      </div>
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 max-w-[90%]">
          <p className="text-sm text-cyan-400 font-bold mb-1 italic">SoulwareAI:</p>
          <p className="text-sm text-gray-300 font-medium">Sistem optimize edildi. Terminal komutlarınızı bekliyor, Mimar.</p>
        </div>
      </div>
      <div className="relative">
        <input 
          type="text" 
          placeholder="Komut girin..." 
          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
        />
      </div>
    </div>
  );
}
