"use client";

import { Suspense } from "react";
import { useInView } from "react-intersection-observer";

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
}

export function LazyWrapper({
  children,
  fallback = <div className="h-20 animate-pulse bg-muted rounded-xl" />,
  threshold = 0.1,
  triggerOnce = true
}: LazyWrapperProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : fallback}
    </div>
  );
}
