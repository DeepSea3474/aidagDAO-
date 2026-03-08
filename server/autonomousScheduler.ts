import OpenAI from "openai";
import { postTweet, postTweetWithMedia } from "./twitter";
import { generateAndSaveImage } from "./imageGenerator";
import { storage } from "./storage";
import * as fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface SchedulerState {
  isRunning: boolean;
  lastTweetAt: Date | null;
  nextTweetAt: Date | null;
  tweetsPosted: number;
  errors: number;
  intervalId: ReturnType<typeof setInterval> | null;
  milestoneCheckId: ReturnType<typeof setInterval> | null;
  lastMilestone: string | null;
}

const state: SchedulerState = {
  isRunning: false,
  lastTweetAt: null,
  nextTweetAt: null,
  tweetsPosted: 0,
  errors: 0,
  intervalId: null,
  milestoneCheckId: null,
  lastMilestone: null,
};

const TWEET_INTERVAL_MS = 6 * 60 * 60 * 1000;
const MILESTONE_CHECK_MS = 30 * 60 * 1000;

const tweetTopics = [
  "presale_update",
  "technology",
  "staking",
  "dao",
  "security",
  "soulware_ai",
  "tokenomics",
  "revenue_share",
  "exchange_listing",
  "community",
];

let topicIndex = 0;

async function generateTweetContent(topic: string): Promise<string> {
  try {
    const prompt = `You are SoulwareAI, the autonomous AI engine of AIDAG Chain. Generate a single tweet (max 270 chars) about the following topic. The tweet should be professional, exciting, and include relevant hashtags. Do NOT use emojis. Include the URL https://aidag-chain.com where relevant.

Topic: ${topic}

Key facts to use:
- AIDAG Chain: World's first DAG consensus + quantum-secure + fully autonomous crypto
- Presale Stage 1: $0.078/AIDAG, Stage 2: $0.093, Listing: $0.12
- Total Supply: 21,000,000 AIDAG
- 40% of ALL ecosystem revenue distributed to holders
- SoulwareAI builds 10 revenue projects autonomously
- Staking APY: 5.2% (Flexible) to 35% (180 days) + 40% revenue share
- DAO membership: $5, includes voting + revenue share
- 6-Layer Quantum-Secure Encryption (CRYSTALS-Dilithium, CRYSTALS-Kyber)
- DAG Consensus: 100,000+ TPS
- Cross-Chain Bridge: BSC + ETH
- Founder tokens locked 1 year

Generate ONLY the tweet text, nothing else. Keep it under 270 characters.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.9,
    });

    const content = response.choices[0]?.message?.content?.trim() || "";
    if (content.length > 280) {
      return content.substring(0, 277) + "...";
    }
    return content;
  } catch (err) {
    console.error("[SoulwareAI Scheduler] AI content generation failed:", err);
    return "";
  }
}

async function postAutonomousTweet(topic: string, triggerType: "scheduled" | "milestone" | "directive"): Promise<boolean> {
  try {
    const content = await generateTweetContent(topic);
    if (!content) {
      console.error("[SoulwareAI Scheduler] Empty content generated, skipping");
      state.errors++;
      return false;
    }

    console.log(`[SoulwareAI Scheduler] Generating neon graphic for topic: ${topic}`);
    let imagePath: string | null = null;
    try {
      imagePath = generateAndSaveImage(topic);
      console.log(`[SoulwareAI Scheduler] Image generated: ${imagePath}`);
    } catch (imgErr) {
      console.error("[SoulwareAI Scheduler] Image generation failed, posting without image:", imgErr);
    }

    console.log(`[SoulwareAI Scheduler] Posting autonomous ${triggerType} tweet about: ${topic}`);
    console.log(`[SoulwareAI Scheduler] Content: ${content}`);

    let result;
    if (imagePath && fs.existsSync(imagePath)) {
      result = await postTweetWithMedia(content, imagePath);
      try { fs.unlinkSync(imagePath); } catch (_) {}
    } else {
      result = await postTweet(content);
    }

    if (result.success) {
      state.tweetsPosted++;
      state.lastTweetAt = new Date();
      state.nextTweetAt = new Date(Date.now() + TWEET_INTERVAL_MS);

      await storage.createAutonomousOp({
        operationType: "twitter_post_with_image",
        module: "SoulwareAI-Twitter",
        description: `Autonomous ${triggerType} tweet with neon graphic posted: "${content.substring(0, 100)}..."`,
        status: "completed",
        chain: "X/Twitter",
        txHash: result.tweetId || null,
        metadata: JSON.stringify({
          topic,
          triggerType,
          tweetId: result.tweetId,
          characterCount: content.length,
          hasImage: !!imagePath,
          imageStyle: "neon-3d-css",
          timestamp: new Date().toISOString(),
        }),
      });

      console.log(`[SoulwareAI Scheduler] Tweet with image posted successfully. ID: ${result.tweetId}`);
      return true;
    } else {
      state.errors++;
      await storage.createAutonomousOp({
        operationType: "twitter_post_with_image",
        module: "SoulwareAI-Twitter",
        description: `Autonomous tweet with image FAILED: ${result.error}`,
        status: "failed",
        chain: "X/Twitter",
        metadata: JSON.stringify({
          topic,
          triggerType,
          error: result.error,
          timestamp: new Date().toISOString(),
        }),
      });
      console.error(`[SoulwareAI Scheduler] Tweet failed: ${result.error}`);
      return false;
    }
  } catch (err) {
    state.errors++;
    console.error("[SoulwareAI Scheduler] Unexpected error:", err);
    return false;
  }
}

async function scheduledTweetCycle() {
  if (!state.isRunning) return;

  const topic = tweetTopics[topicIndex % tweetTopics.length];
  topicIndex++;

  await postAutonomousTweet(topic, "scheduled");
}

async function checkMilestones() {
  if (!state.isRunning) return;

  try {
    const ops = await storage.getAutonomousOps(100);
    const tweetOps = ops.filter(o => o.module === "SoulwareAI-Twitter" && o.status === "completed");
    const totalTweets = tweetOps.length;

    const milestones = [
      { count: 10, id: "10_tweets", topic: "community" },
      { count: 25, id: "25_tweets", topic: "presale_update" },
      { count: 50, id: "50_tweets", topic: "soulware_ai" },
      { count: 100, id: "100_tweets", topic: "technology" },
    ];

    for (const milestone of milestones) {
      if (totalTweets >= milestone.count && state.lastMilestone !== milestone.id) {
        state.lastMilestone = milestone.id;
        const milestoneContent = `SoulwareAI Milestone: ${milestone.count} autonomous posts completed on X! AIDAG Chain's AI engine operates 24/7, building and promoting autonomously. No human intervention. Pure AI-driven growth. https://aidag-chain.com #AIDAG #SoulwareAI #Autonomous`;
        if (milestoneContent.length <= 280) {
          await postTweet(milestoneContent);
          await storage.createAutonomousOp({
            operationType: "twitter_milestone",
            module: "SoulwareAI-Twitter",
            description: `Milestone reached: ${milestone.count} autonomous tweets posted`,
            status: "completed",
            chain: "X/Twitter",
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("[SoulwareAI Scheduler] Milestone check error:", err);
  }
}

export function startAutonomousScheduler() {
  if (state.isRunning) {
    console.log("[SoulwareAI Scheduler] Already running");
    return;
  }

  const hasTwitterKeys = process.env.TWITTER_API_KEY &&
    process.env.TWITTER_API_SECRET &&
    process.env.TWITTER_ACCESS_TOKEN &&
    process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!hasTwitterKeys) {
    console.log("[SoulwareAI Scheduler] Twitter API keys not configured. Scheduler inactive.");
    return;
  }

  state.isRunning = true;
  state.nextTweetAt = new Date(Date.now() + 60000);

  console.log("[SoulwareAI Scheduler] Starting autonomous tweet scheduler");
  console.log(`[SoulwareAI Scheduler] Tweet interval: ${TWEET_INTERVAL_MS / 3600000} hours`);
  console.log(`[SoulwareAI Scheduler] Milestone check: every ${MILESTONE_CHECK_MS / 60000} minutes`);

  setTimeout(async () => {
    if (state.isRunning) {
      await scheduledTweetCycle();
    }
  }, 60000);

  state.intervalId = setInterval(scheduledTweetCycle, TWEET_INTERVAL_MS);
  state.milestoneCheckId = setInterval(checkMilestones, MILESTONE_CHECK_MS);

  storage.createAutonomousOp({
    operationType: "scheduler_start",
    module: "SoulwareAI-Twitter",
    description: "Autonomous tweet scheduler started. SoulwareAI will post AI-generated content every 6 hours.",
    status: "completed",
    chain: "X/Twitter",
    metadata: JSON.stringify({
      intervalHours: TWEET_INTERVAL_MS / 3600000,
      topics: tweetTopics,
      startedAt: new Date().toISOString(),
    }),
  }).catch(err => console.error("[SoulwareAI Scheduler] Failed to log start:", err));

  console.log("[SoulwareAI Scheduler] Autonomous scheduler ACTIVE");
}

export function stopAutonomousScheduler() {
  if (!state.isRunning) return;

  state.isRunning = false;
  if (state.intervalId) clearInterval(state.intervalId);
  if (state.milestoneCheckId) clearInterval(state.milestoneCheckId);
  state.intervalId = null;
  state.milestoneCheckId = null;

  storage.createAutonomousOp({
    operationType: "scheduler_stop",
    module: "SoulwareAI-Twitter",
    description: "Autonomous tweet scheduler stopped by admin.",
    status: "completed",
    chain: "X/Twitter",
  }).catch(err => console.error("[SoulwareAI Scheduler] Failed to log stop:", err));

  console.log("[SoulwareAI Scheduler] Scheduler STOPPED");
}

export function getSchedulerStatus() {
  return {
    isRunning: state.isRunning,
    lastTweetAt: state.lastTweetAt?.toISOString() || null,
    nextTweetAt: state.nextTweetAt?.toISOString() || null,
    tweetsPosted: state.tweetsPosted,
    errors: state.errors,
    currentTopicIndex: topicIndex,
    topics: tweetTopics,
    intervalHours: TWEET_INTERVAL_MS / 3600000,
  };
}

export async function triggerManualTweet(topic?: string): Promise<{ success: boolean; error?: string }> {
  const selectedTopic = topic || tweetTopics[topicIndex % tweetTopics.length];
  topicIndex++;
  const result = await postAutonomousTweet(selectedTopic, "directive");
  return { success: result };
}

export async function triggerPresaleMilestone(milestone: string): Promise<{ success: boolean; error?: string }> {
  const result = await postAutonomousTweet(`presale_milestone_${milestone}`, "milestone");
  return { success: result };
}
