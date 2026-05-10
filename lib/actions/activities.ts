"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { activitySchema } from "@/lib/schemas/trips";

export async function getActivities(stopId: string) {
  return await prisma.tripActivity.findMany({
    where: { stopId },
    include: { activity: true }
  });
}

export async function searchActivities(query: string) {
  return await prisma.activity.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    }
  });
}

export async function addActivityToStop(data: {
  stopId: string;
  activityId?: string;
  customActivity?: any;
  date?: Date;
  time?: string;
  cost?: number;
  notes?: string;
}) {
  let activityId = data.activityId;

  // If no existing activity provided, create custom one
  if (!activityId && data.customActivity) {
    const validatedBase = activitySchema.parse(data.customActivity);
    const newBaseActivity = await prisma.activity.create({
      data: {
        name: validatedBase.name,
        category: validatedBase.category,
        description: validatedBase.description,
        location: validatedBase.location,
        cost: validatedBase.cost,
        duration: validatedBase.duration,
      }
    });
    activityId = newBaseActivity.id;
  }

  if (!activityId) throw new Error("Activity ID or custom activity data required");

  const tripActivity = await prisma.tripActivity.create({
    data: {
      stopId: data.stopId,
      activityId: activityId,
      date: data.date,
      time: data.time,
      cost: data.cost ?? 0,
      notes: data.notes
    },
    include: { stop: true }
  });

  revalidatePath(`/trips/${tripActivity.stop.tripId}`);
  return tripActivity;
}

export async function removeActivityFromStop(id: string) {
  const tripActivity = await prisma.tripActivity.delete({
    where: { id },
    include: { stop: true }
  });

  revalidatePath(`/trips/${tripActivity.stop.tripId}`);
}

export async function getSampleActivities() {
  let activities = await prisma.activity.findMany({ take: 20 });

  if (activities.length === 0) {
    // Seed some defaults if empty
    await prisma.activity.createMany({
      data: [
        { name: "Eiffel Tower", category: "Sightseeing", location: "Paris", cost: 25, duration: 2 },
        { name: "Colosseum Tour", category: "History", location: "Rome", cost: 40, duration: 3 },
        { name: "Sushi Workshop", category: "Food", location: "Tokyo", cost: 60, duration: 2.5 },
        { name: "Snorkeling", category: "Adventure", location: "Bali", cost: 35, duration: 4 },
        { name: "Temple Visit", category: "Culture", location: "Kyoto", cost: 10, duration: 1.5 },
      ]
    });
    activities = await prisma.activity.findMany({ take: 20 });
  }

  return activities;
}
