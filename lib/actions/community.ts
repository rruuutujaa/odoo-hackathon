"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { communityPostSchema } from "@/lib/schemas/trips";

export async function getPosts(search?: string) {
  return await prisma.communityPost.findMany({
    where: search ? {
      content: { contains: search, mode: 'insensitive' }
    } : {},
    include: {
      user: {
        select: { firstName: true, lastName: true, city: true, country: true }
      },
      trip: {
        select: { title: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function addPost(data: { content: string, tripId?: string, userId: string }) {
  const validated = communityPostSchema.parse(data);

  const post = await prisma.communityPost.create({
    data: {
      content: validated.content,
      tripId: data.tripId,
      userId: data.userId
    }
  });

  revalidatePath("/community");
  return post;
}

export async function likePost(id: string) {
  const post = await prisma.communityPost.update({
    where: { id },
    data: { likes: { increment: 1 } }
  });

  revalidatePath("/community");
  return post;
}

export async function getPostsByTrip(tripId: string) {
  return await prisma.communityPost.findMany({
    where: { tripId },
    include: {
      user: { select: { firstName: true, lastName: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}
