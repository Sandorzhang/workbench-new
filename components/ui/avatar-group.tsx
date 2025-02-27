"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
}

export function AvatarGroup({
  children,
  className,
  max,
  ...props
}: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const showMax = max !== undefined && max < childrenArray.length;
  const displayChildren = showMax ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = showMax ? childrenArray.length - max : 0;

  return (
    <div 
      className={cn("flex -space-x-2", className)} 
      {...props}
    >
      {displayChildren}
      
      {showMax && remainingCount > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
          +{remainingCount}
        </div>
      )}
    </div>
  );
} 