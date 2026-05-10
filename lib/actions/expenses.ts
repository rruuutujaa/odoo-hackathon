"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { expenseSchema } from "@/lib/schemas/trips";

export async function getExpenses(tripId: string) {
  return await prisma.expense.findMany({
    where: { tripId },
    orderBy: { createdAt: "desc" }
  });
}

export async function addExpense(data: any) {
  const validated = expenseSchema.parse(data);
  if (!validated.tripId) throw new Error("Trip ID is required");

  // Get current user (must be handled by auth wrapper in real use)
  const trip = await prisma.trip.findUnique({
    where: { id: validated.tripId },
    select: { userId: true }
  });

  if (!trip) throw new Error("Trip not found");

  const expense = await prisma.expense.create({
    data: {
      tripId: validated.tripId,
      userId: trip.userId,
      category: validated.category,
      description: validated.description,
      quantity: validated.quantity,
      unitCost: validated.unitCost,
      amount: validated.amount,
    },
  });

  revalidatePath(`/trips/${validated.tripId}`);
  return expense;
}

export async function deleteExpense(id: string) {
  const expense = await prisma.expense.delete({
    where: { id },
  });

  revalidatePath(`/trips/${expense.tripId}`);
}

export async function getExpenseSummary(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { expenses: true }
  });

  if (!trip) throw new Error("Trip not found");

  const subtotal = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const byCategory = trip.expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return {
    total: subtotal,
    subtotal,
    tax,
    grandTotal,
    remainingBudget: trip.totalBudget - grandTotal,
    byCategory
  };
}
