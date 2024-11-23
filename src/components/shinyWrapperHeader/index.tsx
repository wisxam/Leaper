"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ShinnyWrapperHeader = ({ children, className }: Props) => {
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const childrenRefElement = childrenRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (childrenRefElement) {
        const rect = childrenRefElement.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        childrenRefElement.style.setProperty("--x", `${cursorX}`);
        childrenRefElement.style.setProperty("--y", `${cursorY}`);
      }
    };

    const handleMouseLeave = () => {
      if (childrenRefElement) {
        childrenRefElement.style.setProperty("--x", "857");
        childrenRefElement.style.setProperty("--y", "165");
      }
    };

    childrenRefElement?.addEventListener("mousemove", handleMouseMove);
    childrenRefElement?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      childrenRefElement?.removeEventListener("mousemove", handleMouseMove);
      childrenRefElement?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={childrenRef} className={cn("shiny overflow-hidden", className)}>
      {children}
    </div>
  );
};

export default ShinnyWrapperHeader;
