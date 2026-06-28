"use client";

import React from "react";

export function SceneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-12 items-start pt-[15vh] md:pt-0 md:items-center">
        <div className="col-span-1 md:col-span-6 lg:col-span-5 pointer-events-auto max-w-[640px]">
          {children}
        </div>
      </div>
    </div>
  );
}
