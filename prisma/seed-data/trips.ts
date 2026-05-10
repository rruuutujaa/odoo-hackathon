import { TripStatus, ExpenseCategory, PackingCategory, PaymentStatus } from "@prisma/client";

export const tripData = [
  {
    title: "Europe Adventure",
    description: "A grand tour of Europe's most iconic cities.",
    status: TripStatus.ONGOING,
    startDate: new Date("2026-05-01"),
    endDate: new Date("2026-05-20"),
    totalBudget: 5000,
    isPublic: true,
    stops: [
      { city: "Paris", country: "France", startDate: new Date("2026-05-01"), endDate: new Date("2026-05-07"), budget: 2000, position: 0 },
      { city: "Rome", country: "Italy", startDate: new Date("2026-05-08"), endDate: new Date("2026-05-15"), budget: 2000, position: 1 },
      { city: "Venice", country: "Italy", startDate: new Date("2026-05-16"), endDate: new Date("2026-05-20"), budget: 1000, position: 2 }
    ],
    expenses: [
      { category: ExpenseCategory.TRAVEL, description: "Flight to Paris", quantity: 1, unitCost: 800, amount: 800 },
      { category: ExpenseCategory.HOTEL, description: "Paris Hotel", quantity: 6, unitCost: 150, amount: 900 },
      { category: ExpenseCategory.FOOD, description: "Dinner at Jules Verne", quantity: 2, unitCost: 100, amount: 200 }
    ],
    packingItems: [
      { category: PackingCategory.DOCUMENTS, itemName: "Passport", isPacked: true },
      { category: PackingCategory.ELECTRONICS, itemName: "Camera", isPacked: true },
      { category: PackingCategory.CLOTHING, itemName: "Walking Shoes", isPacked: false }
    ],
    notes: [
      { dayNumber: 1, title: "Arrival", content: "Landed in CDG. The city looks amazing!" },
      { dayNumber: 3, title: "Museum Day", content: "Spent 4 hours in the Louvre. Feet hurt but worth it." }
    ],
    invoice: {
      invoiceNumber: "INV-2026-001",
      subtotal: 1900,
      tax: 95,
      discount: 50,
      grandTotal: 1945,
      travelers: ["Alex Explorer", "Travel Buddy"],
      paymentStatus: PaymentStatus.PAID
    }
  },
  {
    title: "Japan Trip",
    description: "Cherry blossoms and neon lights.",
    status: TripStatus.UPCOMING,
    startDate: new Date("2026-06-10"),
    endDate: new Date("2026-06-25"),
    totalBudget: 6000,
    isPublic: false,
    stops: [
      { city: "Tokyo", country: "Japan", startDate: new Date("2026-06-10"), endDate: new Date("2026-06-17"), budget: 3500, position: 0 },
      { city: "Kyoto", country: "Japan", startDate: new Date("2026-06-18"), endDate: new Date("2026-06-25"), budget: 2500, position: 1 }
    ],
    expenses: [
      { category: ExpenseCategory.TRAVEL, description: "JR Pass", quantity: 1, unitCost: 450, amount: 450 }
    ],
    packingItems: [
      { category: PackingCategory.ELECTRONICS, itemName: "Power Adapter", isPacked: false },
      { category: PackingCategory.OTHER, itemName: "Japanese Phrasebook", isPacked: false }
    ],
    notes: [
      { title: "Planning", content: "Need to book the Ghibli Museum tickets exactly one month before!" }
    ],
    invoice: {
      invoiceNumber: "INV-2026-002",
      subtotal: 450,
      tax: 22.5,
      discount: 0,
      grandTotal: 472.5,
      travelers: ["Alex Explorer"],
      paymentStatus: PaymentStatus.PENDING
    }
  },
  {
    title: "Bali Escape",
    description: "Relaxation and tropical vibes.",
    status: TripStatus.COMPLETED,
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-08-10"),
    totalBudget: 3000,
    isPublic: true,
    stops: [
      { city: "Ubud", country: "Indonesia", startDate: new Date("2025-08-01"), endDate: new Date("2025-08-05"), budget: 1500, position: 0 },
      { city: "Seminyak", country: "Indonesia", startDate: new Date("2025-08-06"), endDate: new Date("2025-08-10"), budget: 1500, position: 1 }
    ],
    expenses: [
      { category: ExpenseCategory.ACTIVITY, description: "Surf Lesson", quantity: 2, unitCost: 40, amount: 80 }
    ],
    packingItems: [
      { category: PackingCategory.CLOTHING, itemName: "Swimwear", isPacked: true },
      { category: PackingCategory.OTHER, itemName: "Sunscreen", isPacked: true }
    ],
    notes: [
      { dayNumber: 5, title: "Monkey Forest", content: "Watch out for your sunglasses! They are sneaky." }
    ],
    invoice: {
      invoiceNumber: "INV-2025-003",
      subtotal: 80,
      tax: 4,
      discount: 0,
      grandTotal: 84,
      travelers: ["Alex Explorer"],
      paymentStatus: PaymentStatus.PAID
    }
  }
];
