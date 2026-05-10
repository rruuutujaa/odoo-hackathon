"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <ErrorState 
        title="Application Error"
        description="Something went wrong while loading this page. Our team has been notified."
        retry={reset}
      />
    </div>
  );
}
