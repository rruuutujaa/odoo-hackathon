"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSharedTrip(tripId: string) {
  // Check if exists
  const existing = await prisma.sharedTrip.findUnique({
    where: { tripId }
  });

  if (existing) return existing;

  // Generate unique slug
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new Error("Trip not found");

  const baseSlug = trip.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

  const shared = await prisma.sharedTrip.create({
    data: {
      tripId,
      slug
    }
  });

  revalidatePath(`/trips/${tripId}`);
  return shared;
}

export async function getSharedTrip(slug: string) {
  return await prisma.sharedTrip.findUnique({
    where: { slug },
    include: {
      trip: {
        include: {
          user: {
            select: { firstName: true, lastName: true, city: true, country: true }
          },
          stops: {
            include: {
              activities: {
                include: { activity: true }
              }
            },
            orderBy: { position: "asc" }
          }
        }
      }
    }
  });
}
