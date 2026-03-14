import React, { useEffect, useState } from "react";

export default function Mainnet() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch('/blocks.json').then(res => res.json()).then(data => setBlocks(data.reverse()));
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#00ff41] p-8 font-mono">
      <h1 className="text-3xl font-bold mb-6 border-b border-green-900 pb-2">🌐 SLC MAINNET EXPLORER</h1>
      <div className="grid gap-4">
        {blocks.map((block: any, i) => (
          <div key={i} className="border border-green-800 p-4 rounded bg-gray-900/50">
            <div className="flex justify-between text-xs text-green-700 mb-2">
              <span>BLOCK #${block.id}</span>
              <span>${block.timestamp}</span>
            </div>
            <p className="text-sm break-all font-bold text-white mb-2 font-mono italic">HASH: ${block.hash}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-3 bg-black/40 border-l-2 border-blue-500 rounded-r">
                <span className="text-blue-400 text-[10px] block font-black uppercase mb-1">💎 CEO (GPT-4o) Insight</span>
                <p className="text-xs italic text-gray-300">"${block.ceo_insight}"</p>
              </div>
              <div className="p-3 bg-black/40 border-l-2 border-[#00ff41] rounded-r">
                <span className="text-[#00ff41] text-[10px] block font-black uppercase mb-1">🤖 ENGINEER (Gemini) Audit</span>
                <p className="text-xs text-gray-300">"${block.engineer_report}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
