"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { stopSchema } from "@/lib/schemas/trips";

export async function getStops(tripId: string) {
  return await prisma.tripStop.findMany({
    where: { tripId },
    orderBy: { position: "asc" }
  });
}

export async function createStop(data: any) {
  const validated = stopSchema.parse(data);
  if (!validated.tripId) throw new Error("Trip ID is required");

  const stop = await prisma.tripStop.create({
    data: {
      tripId: validated.tripId,
      city: validated.city,
      country: validated.country,
      startDate: validated.startDate,
      endDate: validated.endDate,
      budget: validated.budget,
      notes: validated.notes,
      position: validated.position,
    },
  });

  revalidatePath(`/trips/${validated.tripId}`);
  return stop;
}

export async function updateStop(id: string, data: any) {
  const validated = stopSchema.parse(data);
  
  const stop = await prisma.tripStop.update({
    where: { id },
    data: validated,
  });

  revalidatePath(`/trips/${stop.tripId}`);
  return stop;
}

export async function deleteStop(id: string) {
  const stop = await prisma.tripStop.delete({
    where: { id },
  });

  revalidatePath(`/trips/${stop.tripId}`);
}

export async function reorderStops(stops: { id: string, position: number }[]) {
  const transactions = stops.map(stop => 
    prisma.tripStop.update({
      where: { id: stop.id },
      data: { position: stop.position }
    })
  );

  const results = await prisma.$transaction(transactions);
  
  if (results.length > 0) {
    revalidatePath(`/trips/${results[0].tripId}`);
  }
  
  return results;
}
