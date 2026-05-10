import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { activities } from "./seed-data/activities";
import { tripData } from "./seed-data/trips";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seeding...");

  // 1. Cleanup - Delete in reverse order of dependencies
  console.log("🧹 Cleaning up existing data...");
  await prisma.$transaction([
    prisma.sharedTrip.deleteMany(),
    prisma.communityPost.deleteMany(),
    prisma.note.deleteMany(),
    prisma.packingItem.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.expense.deleteMany(),
    prisma.tripActivity.deleteMany(),
    prisma.tripStop.deleteMany(),
    prisma.trip.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // 2. Create Users
  console.log("👤 Seeding users...");
  const adminPassword = await bcrypt.hash("AdminPassword123", 12);
  const userPassword = await bcrypt.hash("UserPassword123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@traveloop.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "Traveloop",
      role: "ADMIN",
      city: "Nagpur",
      country: "India",
      bio: "Master administrator of Traveloop.",
      phone: "9191919191",
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: "user@traveloop.com",
      password: userPassword,
      firstName: "Alex",
      lastName: "Explorer",
      role: "USER",
      city: "Paris",
      country: "France",
      bio: "Passionate traveler and adventure seeker.",
      phone: "1234567890",
    },
  });

  // 3. Seed Activities
  console.log("🎡 Seeding activities...");
  await prisma.activity.createMany({
    data: activities,
  });

  const allActivities = await prisma.activity.findMany();

  // 4. Seed Trips & Related Data
  console.log("✈️ Seeding trips, stops, expenses, and more...");
  for (const tripInfo of tripData) {
    const { stops, expenses, packingItems, notes, invoice, ...tripBase } = tripInfo;

    const createdTrip = await prisma.trip.create({
      data: {
        ...tripBase,
        userId: regularUser.id,
        stops: {
          create: stops.map((stop, sIndex) => ({
            ...stop,
            activities: {
              create: [
                {
                  activityId: allActivities[sIndex % allActivities.length].id,
                  date: stop.startDate,
                  time: "10:00 AM",
                  cost: 50,
                  notes: "Enjoy the morning vibe.",
                },
                {
                  activityId: allActivities[(sIndex + 1) % allActivities.length].id,
                  date: stop.startDate,
                  time: "02:00 PM",
                  cost: 30,
                  notes: "Afternoon exploration.",
                }
              ]
            }
          })),
        },
        expenses: {
          create: expenses.map(exp => ({ ...exp, userId: regularUser.id })),
        },
        packingItems: {
          create: packingItems.map(item => ({ ...item, userId: regularUser.id })),
        },
        notes: {
          create: notes.map(note => ({ ...note, userId: regularUser.id })),
        },
      },
    });

    // Create Invoice for the trip
    if (invoice) {
      await prisma.invoice.create({
        data: {
          ...invoice,
          tripId: createdTrip.id,
        }
      });
    }

    // Create a Shared Trip for the first trip
    if (tripInfo.title === "Europe Adventure") {
      await prisma.sharedTrip.create({
        data: {
          tripId: createdTrip.id,
          slug: "europe-adventure-2026",
        }
      });
    }
  }

  // 5. Community Posts
  console.log("💬 Seeding community posts...");
  const userTrips = await prisma.trip.findMany({ where: { userId: regularUser.id } });
  
  await prisma.communityPost.createMany({
    data: [
      {
        userId: regularUser.id,
        tripId: userTrips[0].id,
        content: "Just started my Europe adventure! Paris is beautiful in the spring. 🗼✨",
        likes: 24,
      },
      {
        userId: regularUser.id,
        tripId: userTrips[1].id,
        content: "Can't wait for my Japan trip next month. Any recommendations for Kyoto? 🍱🇯🇵",
        likes: 15,
      },
      {
        userId: regularUser.id,
        content: "Traveloop is making my planning so much easier! Highly recommend. ✈️",
        likes: 42,
      }
    ]
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
