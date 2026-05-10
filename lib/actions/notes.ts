"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { noteSchema } from "@/lib/schemas/trips";

export async function getNotes(tripId: string, filter?: { day?: number, stopId?: string }) {
  const where: any = { tripId };
  
  if (filter?.day) where.dayNumber = filter.day;
  if (filter?.stopId) where.stopId = filter.stopId;

  return await prisma.note.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });
}

export async function addNote(data: any) {
  const validated = noteSchema.parse(data);
  if (!validated.tripId) throw new Error("Trip ID is required");

  const trip = await prisma.trip.findUnique({
    where: { id: validated.tripId },
    select: { userId: true }
  });

  if (!trip) throw new Error("Trip not found");

  const note = await prisma.note.create({
    data: {
      tripId: validated.tripId,
      userId: trip.userId,
      stopId: validated.stopId,
      title: validated.title,
      content: validated.content,
      dayNumber: validated.dayNumber,
    }
  });

  revalidatePath(`/trips/${validated.tripId}/notes`);
  return note;
}

export async function updateNote(id: string, data: any) {
  const validated = noteSchema.parse(data);
  
  const note = await prisma.note.update({
    where: { id },
    data: validated
  });

  revalidatePath(`/trips/${note.tripId}/notes`);
  return note;
}

export async function deleteNote(id: string) {
  const note = await prisma.note.delete({
    where: { id }
  });

  revalidatePath(`/trips/${note.tripId}/notes`);
}
