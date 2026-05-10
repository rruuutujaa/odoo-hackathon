# Traveloop — The Art of the Journey

**Traveloop** is a premium, editorial-grade travel planning platform designed for the modern explorer. Built with a "Luxury-Minimal" aesthetic, it transforms complex itinerary building into a curated, meaningful experience.

---

## 🌟 Key Features

- **Mission Control Dashboard**: A high-fidelity command center for tracking active operations and upcoming expeditions.
- **Dynamic Itinerary Engine**: A bespoke builder for organizing stops, time-blocked activities, and strategic notes.
- **Social Uplink**: A community-driven feed for sharing intelligence and discovering successful travel routes.
- **Tactical Supply Checklist**: Integrated packing management with real-time progress tracking.
- **Fiscal Ledger & Invoicing**: Automated expense tracking and professional invoice generation for complete financial control.
- **Global Public Sharing**: Read-only itinerary landing pages for sharing your journey with the world.

---

## 🛠️ Technical Excellence

- **Frontend**: Next.js 15 (App Router) + React 19
- **Database**: PostgreSQL (Relational)
- **ORM**: Prisma 6.2.1
- **Authentication**: NextAuth.js v5 (Auth.js) with JWT Sessions
- **Logic**: Type-safe Server Actions (End-to-End Type Safety)
- **Styling**: Tailwind CSS v4 + Framer Motion 12
- **Validation**: Zod + React Hook Form
- **Infrastructure**: Docker + CI/CD (GitHub Actions) + Vitest (Unit Testing)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL instance running locally.

### 2. Initialization
```bash
git clone <repository-url>
cd odoo-hackathon
npm install
```

### 3. Environment Setup
Create a `.env` file and populate it using the template in `keys.txt`.

### 4. Database Sync & Seeding
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Launch
```bash
npm run dev
```
Visit `http://localhost:3000` to initiate your mission.

---

## 📂 Project Architecture

```text
├── app/              # Next.js App Router (Pages & Layouts)
├── components/       # Reusable UI, Layout, & Feature components
│   ├── ui/           # Atomic shadcn-inspired components
│   └── shared/       # Public landing page components
├── lib/              # Core Business Logic
│   ├── actions/      # Prisma Server Actions
│   ├── schemas/      # Zod Validation Layer
│   └── auth.ts       # NextAuth Configuration
├── prisma/           # Database Schema & Seed System
└── tests/            # E2E Playwright Specifications
```

---

## 🛡️ Security & Performance
- **Content Security Policy (CSP)**: Robust headers active via middleware.
- **Rate Limiting**: IP-based protection for API routes.
- **Turbopack**: Optimized for extreme development speed.
- **PWA**: Fully installable with offline fallback support.

---

**Traveloop** was engineered for the **Odoo Hackathon 2026**. Designed for scale, security, and visual impact.
