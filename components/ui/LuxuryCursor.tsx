"use client";

import { useEffect, useRef } from "react";

export default function LuxuryCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.id = "luxury-cursor";
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Smooth lerp for the cursor
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX - 16}px, ${currentY - 16}px, 0)`;
      }
      requestAnimationFrame(animate);
    };

    const onMouseDown = () => {
      if (cursorRef.current) cursorRef.current.style.scale = "0.8";
    };

    const onMouseUp = () => {
      if (cursorRef.current) cursorRef.current.style.scale = "1";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    const animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationFrame);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return null;
}
