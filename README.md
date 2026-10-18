# طاها شوب — Taha Shop

Production-grade Moroccan e-commerce ecosystem.  
Single monorepo, three surfaces: **iOS App**, **Android App**, **Web App**.

---

## Architecture

```
taha-shop/                     ← monorepo root (npm workspaces + Turborepo)
├── apps/
│   ├── mobile/                ← Expo (React Native) — iOS / Android / Web
│   └── web/                   ← Next.js storefront (planned)
├── backend/                   ← Express REST API
│   └── src/
│       ├── config/
│       │   ├── supabase.js    ← Supabase Auth + service-role data client
│       │   ├── database.js    ← Legacy Mongo connection for unmigrated modules
│       │   └── logger.js      ← Winston structured logging
│       ├── middleware/
│       │   ├── supabaseAuth.js ← Supabase JWT verification + role guards
│       │   ├── errorHandler.js
│       │   └── validate.js
│       ├── models/            ← Mongoose schemas (User, Product, Order, …)
│       ├── routes/            ← Express route definitions
│       ├── controllers/       ← Business logic
│       ├── services/
│       │   └── import.service.js ← Smart auto-import (Apify/ScrapingBee)
│       └── server.js          ← Express bootstrap + graceful shutdown
└── packages/
    └── core/                  ← Shared constants, API client factory
```

### Technology Stack

| Layer         | Technology |
|---------------|------------|
| Mobile / Web  | React Native + Expo (Router v4) |
| State         | Zustand + TanStack Query |
| Auth          | Supabase Auth |
| Database      | Supabase PostgreSQL (legacy Mongo only for unmigrated modules) |
| Backend       | Node.js + Express |
| Media         | Cloudflare R2 (`media.mahyshop.com`) |
| Scraping      | Apify / ScrapingBee |
| Tracking      | Meta Pixel, TikTok Pixel, GA4, Snapchat |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-org/taha-shop.git
cd taha-shop
npm install
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY and server-only SUPABASE_SERVICE_ROLE_KEY
# Configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_PUBLIC_BASE_URL

# Mobile
cp apps/mobile/.env.example apps/mobile/.env
# Fill in EXPO_PUBLIC_SUPABASE_* and EXPO_PUBLIC_API_URL
```

### 3. Apply Supabase migrations

For a fresh project, run `backend/src/config/supabase_unified_migration.sql` in the
Supabase SQL editor. For an existing migrated project, run
`backend/src/config/supabase_admin_platform.sql` after the unified migration. Both
files are idempotent and reload the PostgREST schema cache.

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `PAYMENT_CONFIG_ENCRYPTION_KEY` to a
browser/mobile environment. The Express API owns all privileged admin writes.

### 4. Seed remaining legacy modules

```bash
npm run backend:dev &        # start the API (reads .env)
node backend/src/scripts/seed.js
```

### 5. Run the mobile app

```bash
npm run mobile:start
```

### 6. Run the backend in watch mode

```bash
npm run backend:dev
```

---

## Payment Flow — COD + Deposit

1. Customer places order → `POST /api/orders` → status: `pending`
2. Customer pays **30 MAD** shipping deposit (Cash Plus or card)
3. `POST /api/orders/:id/pay-deposit` → status: `deposit_paid`
4. **Purchase pixel** fires client-side (Meta, TikTok, GA4, Snapchat)
5. Remaining balance collected **cash on delivery**

---

## User Roles

| Role       | Capabilities |
|------------|--------------|
| `customer` | Browse, buy, spin wheel |
| `vendor`   | Manage own products & inventory |
| `influencer` | Referral links, promo codes, commission tracking |
| `admin`    | Full platform control |

---

## API Endpoints (summary)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/sync` | Firebase | Provision / sync profile |
| GET  | `/api/auth/me` | Firebase | Current user profile |
| GET  | `/api/products` | public | Product list |
| POST | `/api/products/import/url` | admin | Smart auto-import |
| POST | `/api/orders` | customer | Create COD order |
| POST | `/api/orders/:id/pay-deposit` | customer | Pay deposit + fire pixel |
| POST | `/api/influencers/click` | public | Record referral click |
| POST | `/api/offers/spin` | customer | Spin the wheel |
| GET  | `/api/admin/stats` | admin | Dashboard KPIs |
"# mahyshop" 
