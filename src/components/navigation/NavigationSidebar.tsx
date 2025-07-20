"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { navigationSections, NavigationItem } from "@/lib/navigation";
import { useNavigation } from "@/hooks/useNavigation";
import { cn } from "@/lib/utils";

interface NavigationSidebarProps {
  className?: string;
}

const NavigationItemComponent = ({
  item,
  isActive,
  isCollapsed,
  onNavigate,
}: {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate: (href: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-10",
              isCollapsed && "px-2",
              isActive && "bg-secondary text-secondary-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 ml-2" />
                )}
              </>
            )}
          </Button>
        </CollapsibleTrigger>
        {!isCollapsed && (
          <CollapsibleContent className="space-y-1 ml-4 mt-1">
            {item.children?.map((child) => (
              <Button
                key={child.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 text-sm"
                onClick={() => onNavigate(child.href)}
              >
                <child.icon className="h-3 w-3 mr-2" />
                {child.label}
              </Button>
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  }

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start h-10",
        isCollapsed && "px-2",
        isActive && "bg-secondary text-secondary-foreground",
      )}
      onClick={() => onNavigate(item.href)}
    >
      <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Button>
  );
};

export function NavigationSidebar({ className }: NavigationSidebarProps) {
  const { pathname, isCollapsed, toggleSidebar, navigateWithContext } =
    useNavigation();

  const handleNavigate = (href: string) => {
    navigateWithContext(href, true);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center mr-2">
              <span className="text-primary-foreground font-bold text-sm">
                S
              </span>
            </div>
            <h1 className="text-lg font-bold">SynapseAI</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigationSections.map((section) => (
          <div key={section.id} className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                {section.label}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.children &&
                    item.children.some((child) => pathname === child.href));

                return (
                  <NavigationItemComponent
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                    onNavigate={handleNavigate}
                  />
                );
              })}
            </div>
            {!isCollapsed && <Separator className="my-4" />}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className={cn("w-full justify-start h-10", isCollapsed && "px-2")}
        >
          <HelpCircle className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Help & Support"}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10 text-destructive hover:text-destructive",
            isCollapsed && "px-2",
          )}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
