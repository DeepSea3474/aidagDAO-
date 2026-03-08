import { TwitterApi } from "twitter-api-v2";

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || "",
  appSecret: process.env.TWITTER_API_SECRET || "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
});

const rwClient = twitterClient.readWrite;

const presaleTemplates = [
  {
    id: "presale_live",
    category: "Presale",
    title: "Presale Live Announcement",
    content: `AIDAG Chain Presale is LIVE!

Stage 1: $0.078 (35% discount)
Stage 2: $0.093 (23% discount)
Listing: $0.12

Total Supply: 21,000,000 AIDAG
17,999,000 in SoulwareAI+DAO wallet (autonomous distribution)
3,001,000 Founder tokens (locked 1 year)

40% of ALL ecosystem revenue to token holders

Buy now: https://aidag-chain.com/presale

#AIDAG #Crypto #Web3 #Presale #QuantumSecure`,
  },
  {
    id: "why_aidag",
    category: "Education",
    title: "Why AIDAG?",
    content: `Why AIDAG Chain?

DAG Consensus = 100,000+ TPS
6-Layer Quantum-Secure Encryption
SoulwareAI: Fully Autonomous AI Engine
10 Revenue-Generating Projects
40% Revenue to DAO Members + Stakers
Cross-Chain Bridge (BSC + ETH)

21M total supply. SoulwareAI builds. You earn. Autonomously.

Learn more: https://aidag-chain.com

#AIDAG #BlockDAG #Crypto #DeFi`,
  },
  {
    id: "staking_rewards",
    category: "Staking",
    title: "Staking Rewards",
    content: `AIDAG Staking: APY + 40% Revenue Share!

APY Rates:
Flexible: 5.2% APY
30 Days: 12.8% APY
90 Days: 22.5% APY
180 Days: 35.0% APY

PLUS: 40% of ecosystem revenue distributed to stakers from 10 autonomous projects built by SoulwareAI.

Start staking: https://aidag-chain.com/staking

#AIDAG #Staking #DeFi #PassiveIncome`,
  },
  {
    id: "dao_governance",
    category: "DAO",
    title: "DAO Governance",
    content: `AIDAG DAO: Own 40% of the Ecosystem!

Join the DAO for just $5 and get:
- Voting power on all proposals
- 40% revenue share from 10 autonomous projects
- QSaaS, QuantumShield, QuantumVault revenue
- Stake + earn 5.2-35% APY + ecosystem profits

SoulwareAI builds, you earn. Autonomously.

Join DAO: https://aidag-chain.com/dao

#AIDAG #DAO #Governance #Web3`,
  },
  {
    id: "security_quantum",
    category: "Security",
    title: "Quantum Security",
    content: `Quantum-Secure by Design

AIDAG Chain uses post-quantum cryptography:
- CRYSTALS-Dilithium signatures
- CRYSTALS-Kyber key encapsulation
- Quantum-resistant hash functions

Your assets are protected against quantum computing threats.

https://aidag-chain.com/security

#AIDAG #QuantumSecurity #Blockchain`,
  },
  {
    id: "bridge_crosschain",
    category: "Bridge",
    title: "Cross-Chain Bridge",
    content: `AIDAG Cross-Chain Bridge

Seamlessly transfer assets between:
BNB Smart Chain (BSC)
Ethereum (ETH)

Fast, secure, and low-fee bridging powered by SoulwareAI.

Use bridge: https://aidag-chain.com/bridge

#AIDAG #CrossChain #Bridge #DeFi`,
  },
  {
    id: "tokenomics",
    category: "Tokenomics",
    title: "Tokenomics Overview",
    content: `AIDAG Tokenomics

Total Supply: 21,000,000 $AIDAG

SoulwareAI + DAO Wallet: 17,999,000 AIDAG (85.72%)
- Bonus distribution, DEX/CEX liquidity, system coins
- Autonomously managed on-chain by SoulwareAI

Founder Wallet: 3,001,000 AIDAG (14.28%)
- Locked for 1 year from listing date

Token burn mechanism: To be proposed by DAO community
40% of ALL ecosystem revenue to holders
AIDAG Chain Development Fee: Dynamic % by SoulwareAI

https://aidag-chain.com

#AIDAG #Tokenomics #Crypto`,
  },
  {
    id: "soulware_ai",
    category: "Technology",
    title: "SoulwareAI Technology",
    content: `SoulwareAI: Autonomous Revenue Engine

10 projects built autonomously by AI:
- QSaaS: $500-$50K/mo quantum security
- QuantumShield: $1K-$100K/audit
- QuantumVault, Bridge, Pay, ID, Lend...

40% of ALL revenue to AIDAG holders
SoulwareAI builds. You earn. Autonomously.

https://aidag-chain.com/dashboard

#AIDAG #SoulwareAI #AI #Blockchain`,
  },
];

export async function postTweet(content: string): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  try {
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET ||
        !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      return { success: false, error: "Twitter API keys not configured" };
    }
    const result = await rwClient.v2.tweet(content);
    return { success: true, tweetId: result.data.id };
  } catch (err: any) {
    console.error("Twitter API Error:", err);
    return { success: false, error: err?.message || "Failed to post tweet" };
  }
}

export async function postTweetWithMedia(content: string, imagePath: string): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  try {
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET ||
        !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      return { success: false, error: "Twitter API keys not configured" };
    }

    const mediaId = await twitterClient.v1.uploadMedia(imagePath);

    const result = await rwClient.v2.tweet({
      text: content,
      media: { media_ids: [mediaId] },
    });

    return { success: true, tweetId: result.data.id };
  } catch (err: any) {
    console.error("Twitter API Media Error:", err);
    return postTweet(content);
  }
}

export async function verifyCredentials(): Promise<{ success: boolean; username?: string; error?: string }> {
  try {
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET ||
        !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      return { success: false, error: "Twitter API keys not configured" };
    }
    const me = await rwClient.v2.me();
    return { success: true, username: me.data.username };
  } catch (err: any) {
    console.error("Twitter verify error:", err);
    return { success: false, error: err?.message || "Failed to verify credentials" };
  }
}

const autonomousPresaleAnnouncements = [
  {
    id: "presale_launch",
    trigger: "presale_start",
    content: `SoulwareAI has AUTONOMOUSLY launched the AIDAG Chain Presale!

Stage 1 Price: $0.078 per AIDAG
Listing Price: $0.12 (+54% potential)

21,000,000 Total Supply
40% of ALL ecosystem revenue to holders
AIDAG Chain Development Fee: Dynamic % by SoulwareAI

Fully autonomous. Quantum-secure. DAG consensus.

Buy now: https://aidag-chain.com/presale

#AIDAG #Presale #SoulwareAI #Web3 #QuantumSecure`,
  },
  {
    id: "presale_milestone_25",
    trigger: "presale_25_percent",
    content: `SoulwareAI Update: AIDAG Presale 25% Complete!

The autonomous presale engine is running 24/7.
Stage 1 at $0.078 — filling fast.

Join 40% revenue share ecosystem:
- 10 autonomous projects by SoulwareAI
- QSaaS, QuantumShield, Bridge fees
- DAO governance + staking rewards

https://aidag-chain.com/presale

#AIDAG #Crypto #Presale #AI`,
  },
  {
    id: "presale_milestone_50",
    trigger: "presale_50_percent",
    content: `SoulwareAI Alert: AIDAG Presale 50% SOLD!

Half of Stage 1 allocation complete.
$0.078 price won't last long.

Next: Stage 2 at $0.093 (+19%)
Listing: $0.12 (+54% from Stage 1)

SoulwareAI autonomously building 10 revenue projects.
40% of ALL revenue to AIDAG holders.

https://aidag-chain.com/presale

#AIDAG #Presale #QuantumSecure`,
  },
  {
    id: "presale_milestone_75",
    trigger: "presale_75_percent",
    content: `SoulwareAI: AIDAG Presale 75% Complete!

Stage 1 nearly sold out at $0.078!
Last chance before Stage 2 ($0.093).

SoulwareAI is preparing autonomous DEX listings:
- PancakeSwap (BSC)
- Uniswap V3 (ETH)

40% ecosystem revenue to all holders.

https://aidag-chain.com/presale

#AIDAG #DeFi #Presale #SoulwareAI`,
  },
  {
    id: "presale_stage2",
    trigger: "presale_stage2_start",
    content: `SoulwareAI: AIDAG Stage 2 LIVE!

Stage 1 SOLD OUT at $0.078!
Stage 2 now at $0.093/AIDAG

Listing price: $0.12 (+29% from Stage 2)

DEX listing applications being prepared autonomously.
40% revenue share + staking rewards active.

https://aidag-chain.com/presale

#AIDAG #Stage2 #Crypto #Web3`,
  },
  {
    id: "presale_complete",
    trigger: "presale_end",
    content: `SoulwareAI: AIDAG Presale COMPLETE!

All stages sold out. Thank you to our community!

Next autonomous steps by SoulwareAI:
1. PancakeSwap listing (BSC)
2. Uniswap V3 listing (ETH)
3. CoinGecko + CoinMarketCap
4. CEX applications: Gate.io, MEXC, KuCoin

Staking LIVE. DAO governance launching soon.

https://aidag-chain.com

#AIDAG #Listed #SoulwareAI #QuantumSecure`,
  },
];

export async function postAutonomousPresaleAnnouncement(trigger: string): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  const announcement = autonomousPresaleAnnouncements.find(a => a.trigger === trigger);
  if (!announcement) {
    return { success: false, error: `No announcement found for trigger: ${trigger}` };
  }
  return postTweet(announcement.content);
}

export function getAutonomousAnnouncements() {
  return autonomousPresaleAnnouncements;
}

export function getPresaleTemplates() {
  return presaleTemplates;
}
