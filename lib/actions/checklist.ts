"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { packingItemSchema } from "@/lib/schemas/trips";

export async function getPackingItems(tripId: string) {
  return await prisma.packingItem.findMany({
    where: { tripId },
    orderBy: { createdAt: "asc" }
  });
}

export async function addPackingItem(data: any) {
  const validated = packingItemSchema.parse(data);
  if (!validated.tripId) throw new Error("Trip ID is required");

  const trip = await prisma.trip.findUnique({
    where: { id: validated.tripId },
    select: { userId: true }
  });

  if (!trip) throw new Error("Trip not found");

  const item = await prisma.packingItem.create({
    data: {
      tripId: validated.tripId,
      userId: trip.userId,
      category: validated.category,
      itemName: validated.itemName,
      isPacked: validated.isPacked,
    },
  });

  revalidatePath(`/trips/${validated.tripId}/checklist`);
  return item;
}

export async function togglePackingItem(id: string, isPacked: boolean) {
  const item = await prisma.packingItem.update({
    where: { id },
    data: { isPacked }
  });

  revalidatePath(`/trips/${item.tripId}/checklist`);
  return item;
}

export async function deletePackingItem(id: string) {
  const item = await prisma.packingItem.delete({
    where: { id },
  });

  revalidatePath(`/trips/${item.tripId}/checklist`);
}

export async function resetChecklist(tripId: string) {
  await prisma.packingItem.updateMany({
    where: { tripId },
    data: { isPacked: false }
  });

  revalidatePath(`/trips/${tripId}/checklist`);
}

export async function getChecklistProgress(tripId: string) {
  const items = await prisma.packingItem.findMany({
    where: { tripId }
  });

  const total = items.length;
  const packed = items.filter(i => i.isPacked).length;
  const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

  return {
    packed,
    total,
    percent
  };
}
