"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";

interface NavigationBreadcrumbsProps {
  className?: string;
}

export function NavigationBreadcrumbs({
  className,
}: NavigationBreadcrumbsProps) {
  const { breadcrumbs, navigateWithContext } = useNavigation();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigateWithContext("/dashboard")}
      >
        <Home className="h-3 w-3" />
      </Button>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={item.id}>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2",
                isLast
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => !isLast && navigateWithContext(item.href)}
              disabled={isLast}
            >
              <Icon className="h-3 w-3 mr-1" />
              {item.label}
            </Button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
