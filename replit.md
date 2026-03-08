# AIDAG Chain - Replit Agent Guide

## Overview

AIDAG Chain is a Web3 cryptocurrency project marketing site and dApp for a token called AIDAG — billed as a "quantum-secure AI blockchain" powered by "SoulwareAI." The application is a full-stack TypeScript project with a React frontend and Express backend. It includes a landing page with features/roadmap/stats sections, a token presale page with Web3 wallet integration, a DAO governance page, a SoulwareAI dashboard, a newsletter signup, and a contact form. The backend stores newsletter subscribers and contact messages in PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React + Vite)

- **Location**: `client/` directory
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight React router) with routes: `/`, `/presale`, `/dao`, `/dashboard`, `/staking`, `/brand-kit`, `/exchange-listing`, `/whitepaper`, `/security`, `/ecosystem`, `/explorer`, `/bridge`
- **Styling**: Tailwind CSS with CSS variables for theming (dark futuristic theme by default), plus shadcn/ui component library (new-york style)
- **Animations**: Framer Motion for scroll and entrance animations
- **State Management**: TanStack React Query for server state; React Context for wallet state
- **Forms**: react-hook-form with Zod validation via @hookform/resolvers
- **Web3 Integration**: ethers.js v6 for wallet connection (MetaMask, Trust Wallet, etc.), targeting BSC Mainnet (Chain ID 56) and Ethereum. Wallet state managed via `WalletProvider` context in `client/src/lib/walletContext.tsx`
- **i18n**: i18next with browser language detection (`client/src/lib/i18n.ts`)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`
- **UI Components**: Full shadcn/ui component library installed in `client/src/components/ui/`

### Backend (Express + Node.js)

- **Location**: `server/` directory
- **Framework**: Express.js running on Node.js with TypeScript (via tsx)
- **Entry point**: `server/index.ts` creates HTTP server, registers routes, sets up Vite dev middleware or static serving
- **API Routes**: Defined in `server/routes.ts`:
  - `POST /api/subscribers` — newsletter signup (email)
  - `POST /api/messages` — contact form submission (name, email, subject, message)
  - `POST /api/soulware/chat` — AI-powered SoulwareAI chatbot with streaming (OpenAI GPT-4o-mini), includes founder mode detection for DeepSea3474
  - `GET /api/exchange-listings/config` — exchange listing configuration and liquidity targets
  - `GET /api/founder/directives` — founder directives list (admin-auth required)
  - `POST /api/founder/directives` — create founder directive (admin-auth required)
  - `PATCH /api/founder/directives/:id` — update directive status/response (admin-auth required)
  - `GET /api/founder/briefings` — weekly founder briefings (admin-auth required)
  - `POST /api/founder/briefings` — create weekly briefing (admin-auth required)
  - `PATCH /api/founder/briefings/:id` — update briefing status (admin-auth required)
  - `GET /api/autonomous/ops` — autonomous operation logs (admin-auth required)
  - `POST /api/autonomous/ops` — log new autonomous operation (admin-auth required)
  - `POST /api/founder/generate-report` — AI-generated weekly report for founder (admin-auth required)
- **Storage Layer**: `server/storage.ts` provides a `DatabaseStorage` class implementing `IStorage` interface, using Drizzle ORM
- **Dev vs Prod**: In development, Vite dev server middleware is used (`server/vite.ts`). In production, static files are served from `dist/public` (`server/static.ts`)

### Shared Code

- **Location**: `shared/` directory
- **Schema**: `shared/schema.ts` defines Drizzle ORM PostgreSQL tables (`subscribers`, `messages`) and Zod insert schemas via `drizzle-zod`
- **API Contract**: `shared/routes.ts` defines a typed API contract object with paths, methods, input schemas, and response schemas — used by both frontend and backend for type-safe API calls

### Database

- **Database**: PostgreSQL (required, provisioned via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-orm/node-postgres` driver
- **Schema push**: `npm run db:push` runs `drizzle-kit push` to sync schema to database
- **Migrations**: Output to `./migrations` directory
- **Tables**:
  - `subscribers`: id (serial PK), email (unique), is_active (boolean), created_at (timestamp)
  - `messages`: id (serial PK), name, email, subject (optional), message, created_at (timestamp)
  - `autonomousOps`: id (serial PK), module, action, description, status, chain, txHash, metadata (json), created_at
  - `founderBriefings`: id (serial PK), weekNumber, year, reportContent, aiSummary, status, created_at, reviewed_at
  - `founderDirectives`: id (serial PK), directive, priority, status, soulwareResponse, created_at, completed_at

### Build System

- **Dev**: `npm run dev` — runs `tsx server/index.ts` with Vite middleware for HMR
- **Build**: `npm run build` — runs `script/build.ts` which builds client with Vite and server with esbuild into `dist/`
- **Start**: `npm start` — runs `node dist/index.cjs` in production mode
- **Type check**: `npm run check` — runs TypeScript compiler

### Key Design Decisions

1. **Shared API contract pattern**: The `shared/routes.ts` file provides a single source of truth for API endpoints, input validation, and response types. Both client hooks and server routes reference the same Zod schemas, ensuring type safety end-to-end.

2. **Storage interface abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations, making it possible to swap implementations if needed.

3. **Web3 wallet via native ethers.js**: Rather than using a heavy Web3 modal library at runtime, the project wraps ethers.js `BrowserProvider` in a React context (`WalletProvider`) for wallet connection, chain switching, and transaction sending.

4. **SoulwareAI Chatbot**: `SoulwareAssistant.tsx` is an AI-powered streaming chatbot using OpenAI GPT-4o-mini via `/api/soulware/chat`. Includes **Founder Mode**: when "DeepSea3474" is mentioned, the UI transforms to a golden theme with Crown icon, Shield indicator, and founder-specific quick actions. The backend injects autonomous operations data, briefings, and directives into the AI context for founder reports.

5. **Autonomous Operations System**: Database-backed system for tracking SoulwareAI autonomous operations (`autonomousOps`), founder weekly briefings (`founderBriefings`), and founder directives (`founderDirectives`). Protected by admin auth (`x-admin-key` header matching `SESSION_SECRET`).

6. **Exchange Listing Pipeline**: Autonomous DEX/CEX listing system with liquidity targets, brand kit assets, and application tracking. Configuration served via `/api/exchange-listings/config`.

7. **AIDAG Chain Development Fee**: Dynamic percentage determined by SoulwareAI based on ecosystem profit levels. Transferred autonomously to founder wallet (`0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23`). Independent of DAO governance.

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection via `DATABASE_URL` environment variable. Used with Drizzle ORM and `pg` driver.

### Key NPM Packages
- **Frontend**: React, Vite, wouter, TanStack React Query, framer-motion, ethers.js, i18next, react-hook-form, Zod, shadcn/ui (Radix UI primitives), Tailwind CSS, react-icons
- **Backend**: Express, drizzle-orm, drizzle-zod, pg (node-postgres), connect-pg-simple, Zod, twitter-api-v2
- **Build tools**: tsx, esbuild, drizzle-kit, TypeScript

### Web3 / Blockchain
- **Target chains**: BSC Mainnet (Chain ID 56), Ethereum Mainnet (Chain ID 1)
- **Contract addresses**: Configured in `client/src/lib/web3Config.ts` with env variable overrides (`VITE_TOKEN_CONTRACT`, `VITE_PRESALE_CONTRACT`, `VITE_DAO_WALLET`, etc.)
- **Wallet support**: MetaMask, Trust Wallet, any EIP-1193 compatible wallet via `window.ethereum`

### Environment Variables
- `DATABASE_URL` (required) — PostgreSQL connection string
- `VITE_TOKEN_CONTRACT` (optional) — AIDAG token contract address
- `VITE_PRESALE_CONTRACT` (optional) — Presale contract address
- `VITE_DAO_WALLET` (optional) — DAO wallet address
- `VITE_OPERATION_WALLET` (optional) — Operation wallet address
- `VITE_FOUNDER_WALLET` (optional) — Founder wallet address
- `VITE_PRESALE_STAGE1`, `VITE_PRESALE_STAGE2`, `VITE_LISTING_PRICE`, `VITE_TOKEN_SUPPLY`, `VITE_PRESALE_TARGET` (optional) — Presale configuration
- `SESSION_SECRET` (required) — Used for admin authentication on Twitter API routes
- `TWITTER_API_KEY` (required for Twitter) — X/Twitter API Consumer Key
- `TWITTER_API_SECRET` (required for Twitter) — X/Twitter API Consumer Secret
- `TWITTER_ACCESS_TOKEN` (required for Twitter) — X/Twitter Access Token
- `TWITTER_ACCESS_TOKEN_SECRET` (required for Twitter) — X/Twitter Access Token Secret

### Twitter/X Integration
- **Service**: `server/twitter.ts` — Twitter API v2 client using `twitter-api-v2` package
- **Media Support**: `postTweetWithMedia()` uploads images via v1.1 API before posting tweet with media_ids
- **Routes**: Protected endpoints in `server/routes.ts` (require `x-admin-key` header matching `SESSION_SECRET`)
  - `GET /api/twitter/templates` — Returns presale content templates
  - `POST /api/twitter/tweet` — Posts content to X
  - `GET /api/twitter/verify` — Verifies X API credentials
- **UI**: TwitterManager component in Dashboard page with admin login gate, template selection, tweet composer, and post history

### SoulwareAI Autonomous Twitter Scheduler
- **Service**: `server/autonomousScheduler.ts` — Fully autonomous tweet posting system
- **How it works**: Server startup auto-starts scheduler if Twitter API keys are configured
- **Tweet interval**: Every 6 hours, rotating through 10 topics (presale, technology, staking, dao, security, soulware_ai, tokenomics, revenue_share, exchange_listing, community)
- **AI Content**: Each tweet is dynamically generated by OpenAI GPT-4o-mini — no repeated templates
- **Neon Graphics**: `server/imageGenerator.ts` generates neon/3D-style PNG images using `canvas` (node-canvas). Each topic has a unique color theme (cyan, purple, gold, pink, etc.)
- **Media Upload**: Images uploaded to Twitter v1.1 media endpoint, attached to tweet. Falls back to text-only if image fails.
- **Milestone Detection**: Checks autonomousOps every 30 min for tweet count milestones (10, 25, 50, 100)
- **Logging**: Every tweet (success/fail) logged to `autonomousOps` table with metadata
- **Founder Integration**: Scheduler status included in founder chat context for SoulwareAI reporting
- **API Endpoints** (admin-auth required):
  - `POST /api/autonomous/scheduler/start` — Start scheduler
  - `POST /api/autonomous/scheduler/stop` — Stop scheduler
  - `GET /api/autonomous/scheduler/status` — Get scheduler status
  - `POST /api/autonomous/scheduler/tweet` — Trigger manual tweet with optional topic
  - `POST /api/autonomous/scheduler/milestone` — Trigger presale milestone announcement
  - `GET /api/autonomous/preview-image/:topic` — Preview neon graphic for a topic (returns PNG)