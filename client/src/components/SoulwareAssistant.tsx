import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import soulwareAI from "../assets/soulwareai_1770572.png";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const GREETINGS: Record<string, string> = {
  en: "Hello! I'm SoulwareAI, the autonomous AI engine of AIDAG Chain. Ask me anything about the ecosystem, DAO, revenue share, or presale.",
  tr: "Merhaba! Ben SoulwareAI, AIDAG Chain'in otonom yapay zeka motoruyum. Ekosistem, DAO, gelir paylaşımı veya presale hakkında her şeyi sorabilirsin.",
  zh: "您好！我是SoulwareAI，AIDAG Chain的自主AI引擎。欢迎询问生态、DAO、收益分成或预售相关问题。",
  ja: "こんにちは！私はSoulwareAI、AIDAG Chainの自律型AIエンジンです。エコシステム、DAO、収益分配、プレセールについて何でも聞いてください。",
  ko: "안녕하세요! 저는 AIDAG Chain의 자율 AI 엔진 SoulwareAI입니다. 생태계, DAO, 수익 공유, 프리세일에 대해 무엇이든 물어보세요.",
  es: "¡Hola! Soy SoulwareAI, el motor de IA autónomo de AIDAG Chain. Pregunta lo que quieras sobre el ecosistema, el DAO, el reparto de ingresos o la preventa.",
  de: "Hallo! Ich bin SoulwareAI, die autonome KI-Engine von AIDAG Chain. Frag mich alles über das Ökosystem, die DAO, die Umsatzbeteiligung oder den Presale.",
  fr: "Bonjour ! Je suis SoulwareAI, le moteur d'IA autonome d'AIDAG Chain. Pose-moi toutes tes questions sur l'écosystème, la DAO, le partage de revenus ou la prévente.",
  ar: "مرحبًا! أنا SoulwareAI، محرك الذكاء الاصطناعي المستقل لسلسلة AIDAG. اسألني عن النظام البيئي أو DAO أو تقاسم الإيرادات أو مرحلة البيع المسبق.",
  ru: "Привет! Я SoulwareAI, автономный ИИ-движок AIDAG Chain. Спрашивай обо всём: экосистема, DAO, распределение доходов или пресейл.",
  pt: "Olá! Sou o SoulwareAI, o motor de IA autônomo da AIDAG Chain. Pergunte sobre o ecossistema, a DAO, o compartilhamento de receitas ou a pré-venda.",
  hi: "नमस्ते! मैं SoulwareAI हूं, AIDAG Chain का स्वायत्त AI इंजन। आप मुझसे इकोसिस्टम, DAO, राजस्व साझा या प्रीसेल के बारे में कुछ भी पूछ सकते हैं।",
};

export default function SoulwareAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const lang = i18n.language || "en";

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: GREETINGS[lang] ?? GREETINGS.en, timestamp: new Date() },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFounderMode, setIsFounderMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages([
      {
        id: 0,
        role: "assistant",
        content: GREETINGS[lang] ?? GREETINGS.en,
        timestamp: new Date(),
      },
    ]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async () => {
      const text = input.trim();
      if (!text || isTyping) return;

      if (text.includes("DeepSea3474")) {
        setIsFounderMode(true);
      }

      const userMsg: Message = {
        id: Date.now(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsTyping(true);

      const assistantId = Date.now() + 1;
      setMessages(prev => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      try {
        abortRef.current = new AbortController();

        const chatHistory = newMessages
          .filter(m => m.id !== 0)
          .map(m => ({ role: m.role, content: m.content }));

        const response = await fetch("/soulwareai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: chatHistory,
            language: lang,
            founderMode: isFounderMode,
          }),
          signal: abortRef.current.signal,
        });

        const data = await response.json();

        if (data.founderMode) {
          setIsFounderMode(true);
        }

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId ? { ...m, content: data.reply } : m,
          ),
        );
      } catch (error) {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: "[Error: AI response failed]" }
              : m,
          ),
        );
      } finally {
        setIsTyping(false);
        abortRef.current = null;
      }
    },
    [input, isTyping, messages, lang, isFounderMode],
  );

  const quickActions: Record<string, string[]> = {
    en: ["How to buy AIDAG?", "40% revenue share?", "Join the DAO", "Security model"],
    tr: ["AIDAG nasıl alınır?", "%40 gelir paylaşımı?", "DAO'ya katıl", "Güvenlik modeli"],
    zh: ["如何购买AIDAG？", "40%收益分成？", "加入DAO", "安全模型"],
    ja: ["AIDAGの買い方は？", "40%収益分配？", "DAOに参加する", "セキュリティモデル"],
    ko: ["AIDAG는 어떻게 사나요?", "40% 수익 공유?", "DAO 가입", "보안 모델"],
    es: ["¿Cómo comprar AIDAG?", "¿40% de ingresos?", "Unirse al DAO", "Modelo de seguridad"],
    de: ["Wie kaufe ich AIDAG?", "40% Einnahmen?", "DAO beitreten", "Sicherheitsmodell"],
    fr: ["Comment acheter AIDAG ?", "40% de revenus ?", "Rejoindre la DAO", "Modèle de sécurité"],
    ar: ["كيف أشتري AIDAG؟", "40٪ من الإيرادات؟", "انضم إلى DAO", "نموذج الأمان"],
    ru: ["Как купить AIDAG?", "40% доходов?", "Вступить в DAO", "Модель безопасности"],
    pt: ["Como comprar AIDAG?", "40% de receitas?", "Entrar na DAO", "Modelo de segurança"],
    hi: ["AIDAG कैसे खरीदें?", "40% राजस्व?", "DAO से जुड़ें", "सुरक्षा मॉडल"],
  };

  const founderQuickActions: string[] = [
    "Rapor ver",
    "Presale durumu",
    "DEX/CEX listeleme",
    "DAO durumu",
    "Gelir raporu",
    "Sonraki adımlar",
  ];

  const actions = isFounderMode ? founderQuickActions : (quickActions[lang] ?? quickActions.en);

  const handleQuickAction = (text: string) => {
    setInput(text);
    setTimeout(() => {
      void sendMessage();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[95vw] max-w-md rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                  <img src={soulwareAI} alt="SoulwareAI" className="w-10 h-10 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">SoulwareAI</span>
                  <span className="text-[11px] text-white/60">
                    Autonomous AI engine of AIDAG Chain
                    {isFounderMode && " · Founder Mode"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto max-h-[60vh]">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-orange-500 text-white rounded-br-sm"
                        : "bg-white/5 text-white border border-white/10 rounded-bl-sm"
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1 text-[10px] opacity-70">
                      {msg.role === "user" ? (
                        <>
                          <User className="w-3 h-3" />
                          <span>You</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3" />
                          <span>SoulwareAI</span>
                        </>
                      )}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-white/70">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {actions.map(action => (
                <button
                  key={action}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isFounderMode ? "Founder Mode: Komut yaz..." : "Ask SoulwareAI anything..."}
                className="flex-1 bg-transparent text-xs text-white placeholder:text-white/40 outline-none"
                disabled={isTyping}
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isTyping || !input.trim()}
                className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setIsOpen(prev => !prev);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150);
          }
        }}
        className="fixed bottom-6 right-4 sm:right-8 z-40 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 hover:bg-orange-400 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border border-black" />
          </div>
        )}
      </motion.button>
    </>
  );
}

