"use client";

import { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}
