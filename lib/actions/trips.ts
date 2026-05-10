"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createTripSchema, updateTripSchema } from "@/lib/schemas/trips";

export async function getTrips(userId: string) {
  return await prisma.trip.findMany({
    where: { userId },
    include: {
      stops: true,
      expenses: true,
      invoice: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTripById(id: string) {
  return await prisma.trip.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          city: true,
          country: true
        }
      },
      stops: {
        include: {
          activities: {
            include: {
              activity: true
            }
          }
        },
        orderBy: { position: "asc" }
      },
      expenses: true,
      notes: true,
      packingItems: true,
      invoice: true,
      sharedTrip: true
    },
  });
}

export async function createTrip(data: any, userId: string) {
  const validated = createTripSchema.parse(data);
  
  const trip = await prisma.trip.create({
    data: {
      ...validated,
      userId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/trips");
  
  return trip;
}

export async function updateTrip(id: string, data: any) {
  const validated = updateTripSchema.parse(data);
  
  const trip = await prisma.trip.update({
    where: { id },
    data: validated,
  });

  revalidatePath(`/trips/${id}`);
  return trip;
}

export async function deleteTrip(id: string) {
  await prisma.trip.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/trips");
}

export async function getTripStats(userId: string) {
  const trips = await prisma.trip.findMany({
    where: { userId },
    select: { status: true }
  });

  return {
    total: trips.length,
    ongoing: trips.filter(t => t.status === "ONGOING").length,
    upcoming: trips.filter(t => t.status === "UPCOMING").length,
    completed: trips.filter(t => t.status === "COMPLETED").length,
  };
}
