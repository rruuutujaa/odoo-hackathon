"use client";

import { useEffect } from "react";

export default function LuxuryCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.id = "luxury-cursor";
    document.body.appendChild(cursor);

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
    };

    const onMouseDown = () => {
      cursor.style.transform += " scale(0.8)";
    };

    const onMouseUp = () => {
      cursor.style.transform = cursor.style.transform.replace(" scale(0.8)", "");
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.removeChild(cursor);
    };
  }, []);

  return null;
}
