"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  NavigationItem,
  CrossModuleContext,
  getActiveNavItem,
  getNavigationBreadcrumbs,
} from "@/lib/navigation";

// Custom hook for managing cross-module navigation state
export const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [context, setContext] = useState<CrossModuleContext>({
    currentModule: "dashboard",
    sessionData: {},
    userJourney: {
      path: ["/dashboard"],
      timestamp: Date.now(),
      context: {},
    },
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<NavigationItem | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<NavigationItem[]>([]);

  // Update active navigation item when pathname changes
  useEffect(() => {
    const active = getActiveNavItem(pathname);
    const crumbs = getNavigationBreadcrumbs(pathname);

    setActiveItem(active);
    setBreadcrumbs(crumbs);

    // Update cross-module context
    const currentModule = pathname.split("/")[1] || "dashboard";
    setContext((prev) => ({
      ...prev,
      previousModule: prev.currentModule,
      currentModule,
      userJourney: {
        path: [...(prev.userJourney?.path || []), pathname],
        timestamp: Date.now(),
        context: prev.userJourney?.context || {},
      },
    }));
  }, [pathname]);

  // Navigate with context preservation
  const navigateWithContext = useCallback(
    (href: string, preserveContext = true) => {
      if (preserveContext) {
        // Store current context in sessionStorage for cross-module preservation
        sessionStorage.setItem("synapseai-context", JSON.stringify(context));
      }
      router.push(href);
    },
    [router, context],
  );

  // Update session data for cross-module sharing
  const updateSessionData = useCallback((key: string, data: any) => {
    setContext((prev) => ({
      ...prev,
      sessionData: {
        ...prev.sessionData,
        [key]: data,
      },
    }));
  }, []);

  // Get session data for cross-module access
  const getSessionData = useCallback(
    (key: string) => {
      return context.sessionData?.[key];
    },
    [context.sessionData],
  );

  // Toggle sidebar collapse state
  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Restore context from sessionStorage on mount
  useEffect(() => {
    const savedContext = sessionStorage.getItem("synapseai-context");
    if (savedContext) {
      try {
        const parsed = JSON.parse(savedContext);
        setContext((prev) => ({
          ...prev,
          sessionData: parsed.sessionData || {},
          userJourney: parsed.userJourney || prev.userJourney,
        }));
      } catch (error) {
        console.warn("Failed to restore navigation context:", error);
      }
    }
  }, []);

  return {
    // Navigation state
    pathname,
    activeItem,
    breadcrumbs,
    isCollapsed,
    context,

    // Navigation actions
    navigateWithContext,
    toggleSidebar,

    // Session data management
    updateSessionData,
    getSessionData,

    // Utility functions
    getCurrentModule: () => context.currentModule,
    getPreviousModule: () => context.previousModule,
    getUserJourney: () => context.userJourney,
  };
};
