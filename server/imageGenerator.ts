import { createCanvas, type CanvasRenderingContext2D } from "canvas";
import * as fs from "fs";
import * as path from "path";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 675;

interface NeonTheme {
  primaryGlow: string;
  secondaryGlow: string;
  accentGlow: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  textColor: string;
  subtitleColor: string;
}

const themes: Record<string, NeonTheme> = {
  presale_update: {
    primaryGlow: "#00f5d4",
    secondaryGlow: "#00bbf9",
    accentGlow: "#f15bb5",
    bgGradientStart: "#0a0a1a",
    bgGradientEnd: "#0d1b2a",
    textColor: "#00f5d4",
    subtitleColor: "#a8dadc",
  },
  technology: {
    primaryGlow: "#7b2ff7",
    secondaryGlow: "#00d4ff",
    accentGlow: "#ff6b6b",
    bgGradientStart: "#0a0015",
    bgGradientEnd: "#0d0a2a",
    textColor: "#c77dff",
    subtitleColor: "#b8c0ff",
  },
  staking: {
    primaryGlow: "#ffd60a",
    secondaryGlow: "#00f5d4",
    accentGlow: "#ff6b35",
    bgGradientStart: "#0a0a00",
    bgGradientEnd: "#1a1a0a",
    textColor: "#ffd60a",
    subtitleColor: "#e0e0b0",
  },
  dao: {
    primaryGlow: "#00bbf9",
    secondaryGlow: "#9b5de5",
    accentGlow: "#00f5d4",
    bgGradientStart: "#000a1a",
    bgGradientEnd: "#0a0d2a",
    textColor: "#00bbf9",
    subtitleColor: "#a0c4ff",
  },
  security: {
    primaryGlow: "#ff006e",
    secondaryGlow: "#8338ec",
    accentGlow: "#3a86ff",
    bgGradientStart: "#0a000a",
    bgGradientEnd: "#1a0020",
    textColor: "#ff006e",
    subtitleColor: "#ffb3d9",
  },
  soulware_ai: {
    primaryGlow: "#00f5d4",
    secondaryGlow: "#fee440",
    accentGlow: "#9b5de5",
    bgGradientStart: "#000a0d",
    bgGradientEnd: "#0a1a1d",
    textColor: "#00f5d4",
    subtitleColor: "#a8e6cf",
  },
  tokenomics: {
    primaryGlow: "#f72585",
    secondaryGlow: "#4cc9f0",
    accentGlow: "#7209b7",
    bgGradientStart: "#0a0010",
    bgGradientEnd: "#1a0025",
    textColor: "#f72585",
    subtitleColor: "#ffafcc",
  },
  revenue_share: {
    primaryGlow: "#06d6a0",
    secondaryGlow: "#118ab2",
    accentGlow: "#ffd166",
    bgGradientStart: "#000a05",
    bgGradientEnd: "#001a10",
    textColor: "#06d6a0",
    subtitleColor: "#a8e6cf",
  },
  exchange_listing: {
    primaryGlow: "#4361ee",
    secondaryGlow: "#f72585",
    accentGlow: "#4cc9f0",
    bgGradientStart: "#000510",
    bgGradientEnd: "#0a1025",
    textColor: "#4361ee",
    subtitleColor: "#a0b4f0",
  },
  community: {
    primaryGlow: "#9b5de5",
    secondaryGlow: "#00bbf9",
    accentGlow: "#fee440",
    bgGradientStart: "#0a0015",
    bgGradientEnd: "#150025",
    textColor: "#9b5de5",
    subtitleColor: "#c8a2f0",
  },
};

const topicTitles: Record<string, { title: string; subtitle: string }> = {
  presale_update: { title: "PRESALE LIVE", subtitle: "Stage 1: $0.078 | Listing: $0.12" },
  technology: { title: "DAG CONSENSUS", subtitle: "100,000+ TPS | Quantum-Secure" },
  staking: { title: "STAKING REWARDS", subtitle: "5.2% - 35% APY + 40% Revenue" },
  dao: { title: "DAO GOVERNANCE", subtitle: "Join for $5 | 40% Revenue Share" },
  security: { title: "QUANTUM SHIELD", subtitle: "6-Layer Post-Quantum Encryption" },
  soulware_ai: { title: "SOULWARE AI", subtitle: "Fully Autonomous AI Engine" },
  tokenomics: { title: "TOKENOMICS", subtitle: "21M Supply | 40% to Holders" },
  revenue_share: { title: "REVENUE SHARE", subtitle: "40% Ecosystem Revenue to Holders" },
  exchange_listing: { title: "DEX/CEX LISTING", subtitle: "PancakeSwap | Uniswap | Gate.io" },
  community: { title: "AIDAG COMMUNITY", subtitle: "Building the Future Autonomously" },
};

function drawNeonGlow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, intensity: number = 1) {
  for (let i = 5; i >= 1; i--) {
    ctx.beginPath();
    ctx.arc(x, y, radius + i * 8 * intensity, 0, Math.PI * 2);
    ctx.fillStyle = color + Math.floor(15 / i).toString(16).padStart(2, "0");
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color + "44";
  ctx.fill();
}

function drawNeonLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width: number = 2) {
  for (let i = 4; i >= 1; i--) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color + Math.floor(30 / i).toString(16).padStart(2, "0");
    ctx.lineWidth = width + i * 4;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawNeonText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, fontSize: number, bold: boolean = true) {
  ctx.font = `${bold ? "bold " : ""}${fontSize}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 5; i >= 1; i--) {
    ctx.fillStyle = color + Math.floor(20 / i).toString(16).padStart(2, "0");
    ctx.fillText(text, x, y);
    ctx.lineWidth = i * 2;
    ctx.strokeStyle = color + Math.floor(20 / i).toString(16).padStart(2, "0");
    ctx.strokeText(text, x, y);
  }

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);

  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.3;
  ctx.fillText(text, x, y);
  ctx.globalAlpha = 1;
}

function drawHexagonGrid(ctx: CanvasRenderingContext2D, color: string) {
  const hexSize = 40;
  const hexH = hexSize * Math.sqrt(3);

  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;

  for (let row = -1; row < CANVAS_HEIGHT / hexH + 1; row++) {
    for (let col = -1; col < CANVAS_WIDTH / (hexSize * 1.5) + 1; col++) {
      const cx = col * hexSize * 1.5;
      const cy = row * hexH + (col % 2 === 0 ? 0 : hexH / 2);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const hx = cx + hexSize * Math.cos(angle);
        const hy = cy + hexSize * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

function drawDAGNodes(ctx: CanvasRenderingContext2D, theme: NeonTheme) {
  const nodes: { x: number; y: number; r: number }[] = [];
  const seed = Date.now();
  const pseudoRandom = (n: number) => {
    const x = Math.sin(seed + n * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 12; i++) {
    nodes.push({
      x: 80 + pseudoRandom(i * 3) * (CANVAS_WIDTH - 160),
      y: 80 + pseudoRandom(i * 3 + 1) * (CANVAS_HEIGHT - 160),
      r: 3 + pseudoRandom(i * 3 + 2) * 5,
    });
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.sqrt((nodes[i].x - nodes[j].x) ** 2 + (nodes[i].y - nodes[j].y) ** 2);
      if (dist < 350) {
        ctx.globalAlpha = 0.15 * (1 - dist / 350);
        drawNeonLine(ctx, nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, theme.secondaryGlow, 0.5);
        ctx.globalAlpha = 1;
      }
    }
  }

  for (const node of nodes) {
    drawNeonGlow(ctx, node.x, node.y, node.r, theme.primaryGlow, 0.5);
  }
}

function draw3DBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, depth: number, color: string) {
  ctx.globalAlpha = 0.15;

  ctx.fillStyle = color + "33";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + depth, y - depth);
  ctx.lineTo(x + w + depth, y - depth);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = color + "22";
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + depth, y - depth);
  ctx.lineTo(x + w + depth, y + h - depth);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = color + "11";
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = color + "66";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + depth, y - depth);
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w + depth, y - depth);
  ctx.lineTo(x + w + depth, y + h - depth);
  ctx.lineTo(x + w, y + h);
  ctx.moveTo(x + depth, y - depth);
  ctx.lineTo(x + w + depth, y - depth);
  ctx.stroke();

  ctx.globalAlpha = 1;
}

function drawCircuitLines(ctx: CanvasRenderingContext2D, color: string) {
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  const lines = [
    [0, 150, 200, 150, 230, 120, 350, 120],
    [0, 500, 150, 500, 180, 530, 280, 530],
    [CANVAS_WIDTH, 200, CANVAS_WIDTH - 180, 200, CANVAS_WIDTH - 210, 170, CANVAS_WIDTH - 320, 170],
    [CANVAS_WIDTH, 450, CANVAS_WIDTH - 120, 450, CANVAS_WIDTH - 150, 480, CANVAS_WIDTH - 250, 480],
    [400, CANVAS_HEIGHT, 400, CANVAS_HEIGHT - 80, 430, CANVAS_HEIGHT - 110, 430, CANVAS_HEIGHT - 160],
    [800, 0, 800, 60, 830, 90, 830, 140],
  ];

  for (const pts of lines) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) {
      ctx.lineTo(pts[i], pts[i + 1]);
    }
    ctx.stroke();

    const lastX = pts[pts.length - 2];
    const lastY = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

export function generateTweetImage(topic: string): Buffer {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  const theme = themes[topic] || themes.presale_update;
  const topicInfo = topicTitles[topic] || topicTitles.presale_update;

  const bgGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  bgGrad.addColorStop(0, theme.bgGradientStart);
  bgGrad.addColorStop(0.5, theme.bgGradientEnd);
  bgGrad.addColorStop(1, theme.bgGradientStart);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawHexagonGrid(ctx, theme.secondaryGlow);
  drawCircuitLines(ctx, theme.accentGlow);
  drawDAGNodes(ctx, theme);

  draw3DBox(ctx, 80, 100, CANVAS_WIDTH - 160, CANVAS_HEIGHT - 200, 20, theme.primaryGlow);

  const cornerSize = 30;
  const borderColor = theme.primaryGlow;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = borderColor;
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.moveTo(60, 80 + cornerSize);
  ctx.lineTo(60, 80);
  ctx.lineTo(60 + cornerSize, 80);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH - 60 - cornerSize, 80);
  ctx.lineTo(CANVAS_WIDTH - 60, 80);
  ctx.lineTo(CANVAS_WIDTH - 60, 80 + cornerSize);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(60, CANVAS_HEIGHT - 80 - cornerSize);
  ctx.lineTo(60, CANVAS_HEIGHT - 80);
  ctx.lineTo(60 + cornerSize, CANVAS_HEIGHT - 80);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH - 60 - cornerSize, CANVAS_HEIGHT - 80);
  ctx.lineTo(CANVAS_WIDTH - 60, CANVAS_HEIGHT - 80);
  ctx.lineTo(CANVAS_WIDTH - 60, CANVAS_HEIGHT - 80 - cornerSize);
  ctx.stroke();

  ctx.shadowBlur = 0;

  drawNeonText(ctx, "AIDAG CHAIN", CANVAS_WIDTH / 2, 160, theme.primaryGlow, 64);

  const divY = 210;
  const divWidth = 300;
  drawNeonLine(ctx, CANVAS_WIDTH / 2 - divWidth / 2, divY, CANVAS_WIDTH / 2 + divWidth / 2, divY, theme.accentGlow, 2);
  drawNeonGlow(ctx, CANVAS_WIDTH / 2 - divWidth / 2, divY, 4, theme.accentGlow, 0.6);
  drawNeonGlow(ctx, CANVAS_WIDTH / 2 + divWidth / 2, divY, 4, theme.accentGlow, 0.6);

  drawNeonText(ctx, topicInfo.title, CANVAS_WIDTH / 2, 290, theme.textColor, 48);

  ctx.font = "24px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = theme.subtitleColor;
  ctx.fillText(topicInfo.subtitle, CANVAS_WIDTH / 2, 350);

  const statsY = 430;
  const stats = [
    { label: "TOTAL SUPPLY", value: "21,000,000" },
    { label: "REVENUE SHARE", value: "40%" },
    { label: "MAX APY", value: "35%" },
  ];

  const statWidth = 200;
  const startX = CANVAS_WIDTH / 2 - (stats.length * statWidth) / 2 + statWidth / 2;

  for (let i = 0; i < stats.length; i++) {
    const sx = startX + i * statWidth;

    draw3DBox(ctx, sx - 70, statsY - 30, 140, 70, 8, theme.secondaryGlow);

    ctx.font = "bold 28px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = theme.primaryGlow;
    ctx.shadowColor = theme.primaryGlow;
    ctx.shadowBlur = 10;
    ctx.fillText(stats[i].value, sx, statsY + 5);
    ctx.shadowBlur = 0;

    ctx.font = "12px Arial, sans-serif";
    ctx.fillStyle = theme.subtitleColor;
    ctx.globalAlpha = 0.7;
    ctx.fillText(stats[i].label, sx, statsY + 30);
    ctx.globalAlpha = 1;
  }

  const footerY = CANVAS_HEIGHT - 45;

  ctx.font = "14px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = theme.subtitleColor;
  ctx.globalAlpha = 0.5;
  ctx.fillText("Powered by SoulwareAI", 100, footerY);

  ctx.textAlign = "right";
  ctx.fillText("aidag-chain.com", CANVAS_WIDTH - 100, footerY);
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  ctx.font = "bold 11px Arial, sans-serif";
  ctx.fillStyle = theme.accentGlow;
  ctx.globalAlpha = 0.4;
  ctx.fillText("QUANTUM-SECURE  |  DAG CONSENSUS  |  FULLY AUTONOMOUS", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
  ctx.globalAlpha = 1;

  return canvas.toBuffer("image/png");
}

export function generateAndSaveImage(topic: string): string {
  const buffer = generateTweetImage(topic);
  const tmpDir = "/tmp/aidag-images";
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const filename = `aidag_${topic}_${Date.now()}.png`;
  const filepath = path.join(tmpDir, filename);
  fs.writeFileSync(filepath, buffer);
  return filepath;
}
