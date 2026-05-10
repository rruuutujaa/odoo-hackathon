/**
 * TRAVELOOP APP CONSTANTS
 */

export const APP_CONFIG = {
  name: "Traveloop",
  description: "Seamless travel planning, itinerary building, and community sharing.",
  url: "https://traveloop.app",
  author: "Odoo Hackathon Team",
};

export const THEME_COLORS = {
  primary: "#FF6B35", // Orange
  navy: "#1A1F3C",    // Deep Navy
  background: "#F8F9FA",
  white: "#FFFFFF",
};

export const TRIP_STATUSES = {
  ONGOING: "ONGOING",
  UPCOMING: "UPCOMING",
  COMPLETED: "COMPLETED",
};

export const EXPENSE_CATEGORIES = {
  HOTEL: "HOTEL",
  TRAVEL: "TRAVEL",
  FOOD: "FOOD",
  ACTIVITY: "ACTIVITY",
  OTHER: "OTHER",
};

export const PACKING_CATEGORIES = {
  DOCUMENTS: "DOCUMENTS",
  CLOTHING: "CLOTHING",
  ELECTRONICS: "ELECTRONICS",
  OTHER: "OTHER",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Trips", href: "/trips" },
  { label: "Search", href: "/search" },
  { label: "Community", href: "/community" },
  { label: "Profile", href: "/profile" },
];
