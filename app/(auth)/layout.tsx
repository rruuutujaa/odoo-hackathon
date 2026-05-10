import { Card } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg border-none">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            <span className="bg-primary text-primary-foreground rounded-lg p-1.5 px-2">T</span>
            Traveloop
          </div>
          {children}
        </div>
      </Card>
    </div>
  );
}
