/**
 * TRAVELOOP FORMATTING UTILITIES
 */

export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const formatDateRange = (start: Date | string, end: Date | string) => {
  const s = new Date(start);
  const e = new Date(end);
  
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(s)} - ${new Intl.DateTimeFormat("en-US", { day: "numeric", year: "numeric" }).format(e)}`;
  }
  
  return `${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(s)} - ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(e)}`;
};

export const calculateTripDuration = (start: Date | string, end: Date | string) => {
  const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};
