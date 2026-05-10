"use server";

import prisma from "@/lib/prisma";

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      _count: {
        select: { trips: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAdminStats() {
  const [totalUsers, totalTrips, activeTrips, communityPosts] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.trip.count({ where: { status: "ONGOING" } }),
    prisma.communityPost.count()
  ]);

  return {
    totalUsers,
    totalTrips,
    activeTrips,
    communityPosts
  };
}

export async function getPopularCities() {
  const result = await prisma.tripStop.groupBy({
    by: ['city'],
    _count: {
      city: true
    },
    orderBy: {
      _count: {
        city: 'desc'
      }
    },
    take: 5
  });

  return result.map(r => ({ name: r.city, count: r._count.city }));
}

export async function getPopularActivities() {
  const result = await prisma.tripActivity.groupBy({
    by: ['activityId'],
    _count: {
      activityId: true
    },
    orderBy: {
      _count: {
        activityId: 'desc'
      }
    },
    take: 5
  });

  // Fetch names for these activities
  const activityIds = result.map(r => r.activityId);
  const activities = await prisma.activity.findMany({
    where: { id: { in: activityIds } }
  });

  return result.map(r => ({
    name: activities.find(a => a.id === r.activityId)?.name || 'Unknown',
    count: r._count.activityId
  }));
}

export async function getTripsByDay() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const trips = await prisma.trip.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo }
    },
    select: { createdAt: true }
  });

  // Group by day for chart
  const counts: Record<string, number> = {};
  trips.forEach(t => {
    const day = t.createdAt.toISOString().split('T')[0];
    counts[day] = (counts[day] || 0) + 1;
  });

  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}
