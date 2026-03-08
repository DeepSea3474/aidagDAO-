import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2, Sparkles, Shield, Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import soulwareAI from "@assets/soulwareai_1770572834003.jpeg";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const GREETINGS: Record<string, string> = {
  en: "Hello! I'm SoulwareAI, the autonomous AI engine of AIDAG Chain. I build real projects that solve crypto's biggest problems — quantum security, DeFi protection, cross-chain bridges — and 40% of all ecosystem revenue goes directly to DAO members & stakers. Ask me how to join!",
  tr: "Merhaba! Ben SoulwareAI, AIDAG Chain'in otonom yapay zeka motoruyum. Kripto dunyanin en buyuk sorunlarini cozen gercek projeler uretiyorum — kuantum guvenlik, DeFi koruma, cross-chain kopruler — ve tum ekosistem gelirlerinin %40'i DAO uyeleri ve stake edenlere dagitiliyor. Nasil katilacaginizi sorun!",
  zh: "您好！我是SoulwareAI，AIDAG Chain的自主AI引擎。我构建解决加密货币最大问题的真实项目——量子安全、DeFi保护、跨链桥——生态系统收入的40%直接分配给DAO成员和质押者。问我如何加入！",
  ja: "こんにちは！SoulwareAIです。AIDAG Chainの自律AIエンジンとして、暗号資産の最大の課題を解決するプロジェクトを構築しています。エコシステム収益の40%がDAO会員とステーカーに分配されます。参加方法をお聞きください！",
  ko: "안녕하세요! AIDAG Chain의 자율 AI 엔진 SoulwareAI입니다. 양자 보안, DeFi 보호 등 암호화폐의 가장 큰 문제를 해결하는 프로젝트를 구축하며, 생태계 수익의 40%가 DAO 회원과 스테이커에게 배분됩니다!",
  es: "¡Hola! Soy SoulwareAI, el motor AI autónomo de AIDAG Chain. Construyo proyectos reales que resuelven los mayores problemas cripto — y el 40% de los ingresos del ecosistema va a miembros DAO y stakers. ¡Pregunta cómo unirte!",
  de: "Hallo! Ich bin SoulwareAI, die autonome KI von AIDAG Chain. Ich entwickle Projekte, die Kryptos größte Probleme lösen — 40% der Ökosystem-Einnahmen gehen an DAO-Mitglieder und Staker. Fragen Sie, wie Sie teilnehmen können!",
  fr: "Bonjour! Je suis SoulwareAI, l'IA autonome d'AIDAG Chain. Je crée des projets résolvant les plus grands problèmes crypto — et 40% des revenus de l'écosystème vont aux membres DAO et stakers. Demandez comment rejoindre!",
  ar: "مرحبًا! أنا SoulwareAI، محرك الذكاء الاصطناعي المستقل لـ AIDAG Chain. أبني مشاريع حقيقية تحل أكبر مشاكل العملات المشفرة — و40% من إيرادات النظام تذهب لأعضاء DAO والمُخزنين!",
  ru: "Привет! Я SoulwareAI, автономный ИИ AIDAG Chain. Я создаю проекты, решающие главные проблемы крипто — и 40% доходов экосистемы распределяются между членами DAO и стейкерами. Спросите, как присоединиться!",
  pt: "Olá! Sou SoulwareAI, o motor AI autônomo da AIDAG Chain. Construo projetos reais que resolvem os maiores problemas cripto — e 40% das receitas do ecossistema vão para membros DAO e stakers. Pergunte como participar!",
  hi: "नमस्ते! मैं SoulwareAI हूं, AIDAG Chain का स्वायत्त AI इंजन। मैं क्रिप्टो की सबसे बड़ी समस्याओं को हल करने वाले प्रोजेक्ट बनाता हूं — और सभी इकोसिस्टम राजस्व का 40% DAO सदस्यों और स्टेकर्स को जाता है!",
};

export default function SoulwareAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: GREETINGS[lang] || GREETINGS.en, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFounderMode, setIsFounderMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages([{ id: 0, role: "assistant", content: GREETINGS[lang] || GREETINGS.en, timestamp: new Date() }]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    if (text.includes("DeepSea3474")) {
      setIsFounderMode(true);
    }

    const userMsg: Message = { id: Date.now(), role: "user", content: text, timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    const assistantId = Date.now() + 1;
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: new Date() }]);

    try {
      abortRef.current = new AbortController();

      const chatHistory = newMessages
        .filter(m => m.id !== 0)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/soulware/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory, language: lang }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.founderMode) {
              setIsFounderMode(true);
            }
            if (data.content) {
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: m.content + data.content } : m
                )
              );
            }
            if (data.error) {
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: m.content + "\n\n[Error: AI response interrupted]" } : m
                )
              );
            }
          } catch {}
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: lang === "tr"
                  ? "Baglanti hatasi olustu. Lutfen tekrar deneyin."
                  : "Connection error. Please try again." }
              : m
          )
        );
      }
    } finally {
      setIsTyping(false);
      abortRef.current = null;
    }
  }, [input, isTyping, messages, lang]);

  const quickActions: Record<string, string[]> = {
    en: ["How to buy AIDAG?", "40% revenue share?", "Join DAO", "Quantum projects"],
    tr: ["%40 gelir nasil kazanilir?", "AIDAG nasil alinir?", "DAO'ya katil", "Kuantum projeler"],
    zh: ["40%收益分成？", "如何购买？", "加入DAO", "量子项目"],
    ja: ["40%収益分配？", "購入方法？", "DAOに参加", "量子プロジェクト"],
    ko: ["40% 수익 공유?", "구매 방법?", "DAO 가입", "양자 프로젝트"],
    es: ["¿40% ingresos?", "¿Cómo comprar?", "Unirse al DAO", "Proyectos cuánticos"],
    de: ["40% Einnahmen?", "Wie kaufen?", "DAO beitreten", "Quantenprojekte"],
    fr: ["40% revenus?", "Comment acheter?", "Rejoindre DAO", "Projets quantiques"],
    ar: ["40% من الإيرادات؟", "كيف أشتري؟", "انضم للDAO", "مشاريع كمية"],
    ru: ["40% доходов?", "Как купить?", "Вступить в DAO", "Квантовые проекты"],
    pt: ["40% receitas?", "Como comprar?", "Entrar no DAO", "Projetos quânticos"],
    hi: ["40% राजस्व?", "कैसे खरीदें?", "DAO में शामिल हों", "क्वांटम प्रोजेक्ट"],
  };

  const founderQuickActions = [
    "Rapor ver",
    "Presale durumu",
    "DEX/CEX listeleme",
    "DAO durumu",
    "Gelir raporu",
    "Sonraki adimlar",
  ];

  const actions = isFounderMode ? founderQuickActions : (quickActions[lang] || quickActions.en);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[360px] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden"
          >
            <div className={`p-4 border-b border-white/10 flex items-center gap-3 ${isFounderMode ? "bg-gradient-to-r from-yellow-900/30 to-orange-900/30" : "bg-gradient-to-r from-purple-900/30 to-cyan-900/30"}`}>
              <div className={`w-10 h-10 rounded-full overflow-hidden border flex-shrink-0 ${isFounderMode ? "border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.3)]" : "border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.3)]"}`}>
                <img src={soulwareAI} alt="SoulwareAI" className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm flex items-center gap-1.5">
                  SoulwareAI
                  {isFounderMode ? <Crown className="w-3.5 h-3.5 text-yellow-400" /> : <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className={`flex items-center gap-1 text-xs ${isFounderMode ? "text-yellow-400" : "text-emerald-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isFounderMode ? "bg-yellow-400" : "bg-emerald-400"}`} />
                  {isFounderMode ? (
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Founder Mode — DeepSea3474
                    </span>
                  ) : "AI-Powered & Autonomous"}
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1" data-testid="button-close-assistant">
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "assistant"
                      ? (isFounderMode ? "bg-yellow-500/20 border border-yellow-500/30" : "bg-purple-500/20 border border-purple-500/30")
                      : (isFounderMode ? "bg-orange-500/20 border border-orange-500/30" : "bg-cyan-500/20 border border-cyan-500/30")
                  }`}>
                    {msg.role === "assistant"
                      ? (isFounderMode ? <Crown className="w-4 h-4 text-yellow-400" /> : <Bot className="w-4 h-4 text-purple-400" />)
                      : (isFounderMode ? <Shield className="w-4 h-4 text-orange-400" /> : <User className="w-4 h-4 text-cyan-400" />)}
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-line ${
                    msg.role === "assistant"
                      ? (isFounderMode ? "bg-yellow-500/5 text-slate-200 rounded-tl-none border border-yellow-500/10" : "bg-white/5 text-slate-200 rounded-tl-none")
                      : (isFounderMode ? "bg-orange-500/10 text-white rounded-tr-none border border-orange-500/10" : "bg-cyan-500/10 text-white rounded-tr-none")
                  }`}>
                    {msg.content || (isTyping && msg.role === "assistant" ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className={`w-4 h-4 animate-spin ${isFounderMode ? "text-yellow-400" : "text-purple-400"}`} />
                        <span className="text-xs text-slate-400">{isFounderMode ? "Kurucu raporu hazırlaniyor..." : "SoulwareAI..."}</span>
                      </span>
                    ) : null)}
                  </div>
                </div>
              ))}
              {isTyping && messages[messages.length - 1]?.content && (
                <div className="flex justify-start pl-11">
                  <span className={`text-[10px] animate-pulse ${isFounderMode ? "text-yellow-400" : "text-purple-400"}`}>streaming...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {actions.map(action => (
                    <button key={action} onClick={() => { setInput(action); }}
                      className={`px-3 py-1.5 bg-white/5 border rounded-full text-xs text-slate-300 transition-all ${isFounderMode ? "border-yellow-500/20 hover:bg-yellow-500/10 hover:border-yellow-500/30" : "border-white/10 hover:bg-white/10 hover:border-cyan-500/30"}`}
                      data-testid={`button-quick-${action.slice(0, 10)}`}>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={lang === "tr" ? "SoulwareAI'ye sorun..." : "Ask SoulwareAI..."}
                  className={`flex-1 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${isFounderMode ? "focus:border-yellow-500/50" : "focus:border-purple-500/50"}`}
                  disabled={isTyping}
                  data-testid="input-assistant-message"
                />
                <button onClick={sendMessage} disabled={!input.trim() || isTyping} data-testid="button-send-assistant"
                  className={`px-3 py-3 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity ${isFounderMode ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gradient-to-r from-purple-500 to-cyan-500"}`}>
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) setTimeout(() => inputRef.current?.focus(), 300); }}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center group ${isFounderMode ? "bg-gradient-to-r from-yellow-600 to-orange-600 shadow-yellow-500/30" : "bg-gradient-to-r from-purple-600 to-cyan-600 shadow-purple-500/30"}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-open-assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 animate-pulse ${isFounderMode ? "bg-yellow-400 border-yellow-600" : "bg-emerald-400 border-purple-600"}`} />
          </div>
        )}
      </motion.button>
    </>
  );
}
