# Traveloop Seeding Guide

This project includes a comprehensive seeding system to help you set up a realistic development environment quickly.

## 1. Setup

### Prerequisites
- PostgreSQL running locally.
- `.env` file with a valid `DATABASE_URL`.

### Initialization
If you haven't already, install the dependencies and generate the Prisma Client:
```bash
npm install
npx prisma generate
```

## 2. Seeding Commands

### Run Initial Seed
To populate the database for the first time:
```bash
npx prisma db seed
```

### Reset and Reseed
To clear all data and start fresh (recommended during development):
```bash
npx prisma migrate reset
```
*Note: This will automatically run the seed script after the reset.*

## 3. Test Credentials

You can use these accounts to explore the app:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@traveloop.com` | `AdminPassword123` |
| **User** | `user@traveloop.com` | `UserPassword123` |

## 4. Seeding Structure

The seed script (`prisma/seed.ts`) orchestrates the following:
1. **Cleanup**: Deletes all existing records to prevent duplicates.
2. **Users**: Creates one Admin and one Regular User.
3. **Activities**: Seeds 20+ global activities from `prisma/seed-data/activities.ts`.
4. **Trips**: Creates 3 comprehensive trips for the regular user:
   - **Europe Adventure** (Ongoing)
   - **Japan Trip** (Upcoming)
   - **Bali Escape** (Completed)
5. **Relational Data**: Each trip includes stops, specific activities, expenses, packing items, and notes.
6. **Social & Sharing**: Seeds community posts and a public sharing slug.

## 5. Development Workflow

1. Modify `prisma/schema.prisma` if you need new fields.
2. Run `npx prisma migrate dev --name <name>` to apply changes.
3. Update seed data in `prisma/seed-data/` if necessary.
4. Run `npx prisma db seed` to refresh your local data.
