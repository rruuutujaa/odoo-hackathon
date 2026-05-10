# Traveloop Production Guide

## 1. Project Architecture
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Local/Neon/Railway)
- **ORM**: Prisma
- **Auth**: NextAuth v5 (Auth.js) with JWT Sessions
- **Logic**: Server Actions (use server)
- **UI**: Tailwind CSS + shadcn/ui + Framer Motion
- **Validation**: Zod + React Hook Form

## 2. Environment Setup
Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/traveloop"
NEXTAUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Production Checklist

### Security
- [ ] Set `NODE_ENV` to `production`
- [ ] Use a strong `NEXTAUTH_SECRET`
- [ ] Configure RLS policies on PostgreSQL if using a hosted service
- [ ] Use `bcryptjs` with high salt rounds (done)
- [ ] Ensure all Server Actions validate session (auth())

### Performance
- [ ] Optimize images via `next/image`
- [ ] Use `Suspense` boundaries for data fetching (done)
- [ ] Implement Prisma indexes for `userId` and `tripId`
- [ ] Enable Gzip/Brotli compression (done in next.config.ts)

### SEO
- [ ] Update `metadata` in `app/layout.tsx`
- [ ] Add `robots.txt` and `sitemap.xml`
- [ ] Ensure public shared trips have proper OpenGraph tags

## 4. Deployment
Recommended: **Vercel** or **Railway**.
1. Run `npx prisma generate`
2. Run `npx prisma migrate deploy`
3. Run `npm run build`

## 5. Maintenance
- **Backups**: Regular `pg_dump` of the traveloop database.
- **Prisma Studio**: Use `npx prisma studio` for easy data browsing.
- **Migrations**: Always use `npx prisma migrate dev` during local development.
