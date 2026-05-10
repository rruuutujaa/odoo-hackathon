import { notFound } from "next/navigation";
import { getTripById } from "@/lib/actions/trips";
import { getExpenseSummary } from "@/lib/actions/expenses";
import InvoicePageClient from "./InvoicePageClient";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) notFound();

  const summary = await getExpenseSummary(id);

  return <InvoicePageClient trip={trip} summary={summary} id={id} />;
}
