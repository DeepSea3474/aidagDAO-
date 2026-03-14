import { Link } from "wouter";

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4 bg-[#050505] border-b border-gray-900 shadow-2xl">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-white font-black text-2xl tracking-tighter hover:text-[#00ff41] transition-colors">aidagDAO</Link>
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-all">Dashboard</Link>
          <Link href="/mainnet" className="bg-[#00ff41]/10 text-[#00ff41] px-3 py-1 rounded border border-[#00ff41]/20 hover:bg-[#00ff41] hover:text-black text-sm font-bold uppercase tracking-widest transition-all">🌐 Mainnet</Link>
        </div>
      </div>
    </nav>
  );
}
// Force Update: Sat Mar 14 19:59:41 CET 2026
