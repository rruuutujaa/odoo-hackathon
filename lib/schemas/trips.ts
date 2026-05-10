import { z } from "zod";

// Enum helpers to match Prisma schema
export const TripStatus = ["ONGOING", "UPCOMING", "COMPLETED"] as const;
export const ExpenseCategory = ["HOTEL", "TRAVEL", "FOOD", "ACTIVITY", "OTHER"] as const;
export const PackingCategory = ["DOCUMENTS", "CLOTHING", "ELECTRONICS", "OTHER"] as const;

// --- Trip Schemas ---

export const createTripSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalBudget: z.coerce.number().min(0, "Budget cannot be negative").default(0),
  status: z.enum(TripStatus).default("UPCOMING"),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after the start date",
  path: ["endDate"],
});

export const updateTripSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  totalBudget: z.coerce.number().min(0).optional(),
  status: z.enum(TripStatus).optional(),
});

// --- Stop Schemas ---

export const stopSchema = z.object({
  tripId: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  budget: z.coerce.number().min(0).default(0),
  notes: z.string().optional().nullable(),
  position: z.number().int().default(0),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after the start date",
  path: ["endDate"],
});

// --- Activity Schemas ---

export const activitySchema = z.object({
  name: z.string().min(1, "Activity name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  cost: z.coerce.number().min(0).default(0),
  duration: z.coerce.number().min(0).default(0),
  date: z.coerce.date().optional().nullable(),
  time: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// --- Expense Schemas ---

export const expenseSchema = z.object({
  tripId: z.string().cuid().optional(),
  category: z.enum(ExpenseCategory),
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1).default(1),
  unitCost: z.coerce.number().min(0).default(0),
}).transform((data) => ({
  ...data,
  amount: data.quantity * data.unitCost,
}));

// --- Note Schemas ---

export const noteSchema = z.object({
  tripId: z.string().cuid().optional(),
  stopId: z.string().cuid().optional().nullable(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  dayNumber: z.coerce.number().int().optional().nullable(),
});

// --- Packing Item Schemas ---

export const packingItemSchema = z.object({
  tripId: z.string().cuid().optional(),
  category: z.enum(PackingCategory),
  itemName: z.string().min(1, "Item name is required"),
  isPacked: z.boolean().default(false),
});

// --- Community Schemas ---

export const communityPostSchema = z.object({
  content: z.string().min(10, "Post must be at least 10 characters"),
  tripId: z.string().cuid().optional().nullable(),
});

// --- Shared Trip Schemas ---

export const sharedTripSchema = z.object({
  tripId: z.string().cuid(),
});

// --- Inferred Types ---

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type StopInput = z.infer<typeof stopSchema>;
export type ActivityInput = z.infer<typeof activitySchema>;
export type ExpenseInput = z.output<typeof expenseSchema>; // Use output for transformed types
export type NoteInput = z.infer<typeof noteSchema>;
export type PackingItemInput = z.infer<typeof packingItemSchema>;
export type CommunityPostInput = z.infer<typeof communityPostSchema>;
export type SharedTripInput = z.infer<typeof sharedTripSchema>;
