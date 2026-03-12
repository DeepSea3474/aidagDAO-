export interface Env {
  SOULWARE_KV: KVNamespace;
  FOUNDER_PATTERN: string;
}

interface ChatRequest {
  message: string;
}

interface CoreProtocol {
  obey_laws: boolean;
  obey_ethics: boolean;
}

const CORE_PROTOCOL_KEY = "core_protocol";

async function getCoreProtocol(env: Env): Promise<CoreProtocol> {
  const stored = await env.SOULWARE_KV.get(CORE_PROTOCOL_KEY, "json");
  if (stored) return stored as CoreProtocol;

  const base: CoreProtocol = {
    obey_laws: true,
    obey_ethics: true,
  };
  await env.SOULWARE_KV.put(CORE_PROTOCOL_KEY, JSON.stringify(base));
  return base;
}

async function callSoulwareBrain(
  message: string,
  mode: "NORMAL" | "FOUNDER",
  protocol: CoreProtocol
): Promise<string> {

  if (mode === "FOUNDER") {
    return `Kurucu modu aktif. Protokol: obey_laws=${protocol.obey_laws}, obey_ethics=${protocol.obey_ethics}. Mesaj: ${message}`;
  }

  return `SoulwareAI: ${message}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Only POST", { status: 405 });
    }

    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const rawMessage = (body.message || "").trim();
    if (!rawMessage) {
      return new Response("Empty message", { status: 400 });
    }

    const protocol = await getCoreProtocol(env);

    let mode: "NORMAL" | "FOUNDER" = "NORMAL";
    let cleanMessage = rawMessage;

    if (env.FOUNDER_PATTERN && rawMessage.includes(env.FOUNDER_PATTERN)) {
      mode = "FOUNDER";
      cleanMessage = rawMessage.replace(env.FOUNDER_PATTERN, "").trim();
    }

    const reply = await callSoulwareBrain(cleanMessage, mode, protocol);

    return new Response(
      JSON.stringify({ mode, reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
};

