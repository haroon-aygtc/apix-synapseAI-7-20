import {
  LayoutDashboard,
  MessageSquare,
  Wrench,
  Users,
  Settings,
  BookOpen,
  BarChart3,
  TestTube,
  Palette,
  Zap,
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  badge?: string | number;
  children?: NavigationItem[];
  isActive?: boolean;
  permissions?: string[];
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

// Core navigation structure for SynapseAI platform
export const navigationSections: NavigationSection[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        isActive: true,
      },
    ],
  },
  {
    id: "core-modules",
    label: "Core Modules",
    items: [
      {
        id: "agents",
        label: "Agents",
        icon: MessageSquare,
        href: "/agents",
        badge: "24",
        children: [
          {
            id: "agents-list",
            label: "All Agents",
            icon: MessageSquare,
            href: "/agents",
          },
          {
            id: "agents-create",
            label: "Create Agent",
            icon: MessageSquare,
            href: "/agents/create",
          },
          {
            id: "agents-templates",
            label: "Templates",
            icon: MessageSquare,
            href: "/agents/templates",
          },
        ],
      },
      {
        id: "tools",
        label: "Tools",
        icon: Wrench,
        href: "/tools",
        badge: "18",
        children: [
          {
            id: "tools-list",
            label: "All Tools",
            icon: Wrench,
            href: "/tools",
          },
          {
            id: "tools-create",
            label: "Create Tool",
            icon: Wrench,
            href: "/tools/create",
          },
          {
            id: "tools-marketplace",
            label: "Marketplace",
            icon: Wrench,
            href: "/tools/marketplace",
          },
        ],
      },
      {
        id: "workflows",
        label: "Workflows",
        icon: Zap,
        href: "/workflows",
        badge: "7",
        children: [
          {
            id: "workflows-list",
            label: "All Workflows",
            icon: Zap,
            href: "/workflows",
          },
          {
            id: "workflows-create",
            label: "Create Workflow",
            icon: Zap,
            href: "/workflows/create",
          },
          {
            id: "workflows-templates",
            label: "Templates",
            icon: Zap,
            href: "/workflows/templates",
          },
        ],
      },
      {
        id: "knowledge",
        label: "Knowledge Base",
        icon: BookOpen,
        href: "/knowledge",
        children: [
          {
            id: "knowledge-documents",
            label: "Documents",
            icon: BookOpen,
            href: "/knowledge/documents",
          },
          {
            id: "knowledge-search",
            label: "Search",
            icon: BookOpen,
            href: "/knowledge/search",
          },
          {
            id: "knowledge-collections",
            label: "Collections",
            icon: BookOpen,
            href: "/knowledge/collections",
          },
        ],
      },
      {
        id: "widgets",
        label: "Widgets",
        icon: Palette,
        href: "/widgets",
        children: [
          {
            id: "widgets-list",
            label: "All Widgets",
            icon: Palette,
            href: "/widgets",
          },
          {
            id: "widgets-create",
            label: "Create Widget",
            icon: Palette,
            href: "/widgets/create",
          },
          {
            id: "widgets-templates",
            label: "Templates",
            icon: Palette,
            href: "/widgets/templates",
          },
        ],
      },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    items: [
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        href: "/analytics",
        children: [
          {
            id: "analytics-overview",
            label: "Overview",
            icon: BarChart3,
            href: "/analytics",
          },
          {
            id: "analytics-performance",
            label: "Performance",
            icon: BarChart3,
            href: "/analytics/performance",
          },
          {
            id: "analytics-costs",
            label: "Costs",
            icon: BarChart3,
            href: "/analytics/costs",
          },
        ],
      },
      {
        id: "apix",
        label: "APIX Engine",
        icon: Zap,
        href: "/apix",
        badge: "Real-time",
      },
      {
        id: "sandbox",
        label: "Testing Sandbox",
        icon: TestTube,
        href: "/sandbox",
        children: [
          {
            id: "sandbox-agents",
            label: "Test Agents",
            icon: TestTube,
            href: "/sandbox/agents",
          },
          {
            id: "sandbox-tools",
            label: "Test Tools",
            icon: TestTube,
            href: "/sandbox/tools",
          },
          {
            id: "sandbox-workflows",
            label: "Test Workflows",
            icon: TestTube,
            href: "/sandbox/workflows",
          },
        ],
      },
      {
        id: "team",
        label: "Team",
        icon: Users,
        href: "/team",
        children: [
          {
            id: "team-members",
            label: "Members",
            icon: Users,
            href: "/team/members",
          },
          {
            id: "team-roles",
            label: "Roles & Permissions",
            icon: Users,
            href: "/team/roles",
          },
          {
            id: "team-invites",
            label: "Invitations",
            icon: Users,
            href: "/team/invites",
          },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        href: "/settings",
        children: [
          {
            id: "settings-profile",
            label: "Profile",
            icon: Settings,
            href: "/settings/profile",
          },
          {
            id: "settings-organization",
            label: "Organization",
            icon: Settings,
            href: "/settings/organization",
          },
          {
            id: "settings-billing",
            label: "Billing",
            icon: Settings,
            href: "/settings/billing",
          },
          {
            id: "settings-integrations",
            label: "Integrations",
            icon: Settings,
            href: "/settings/integrations",
          },
        ],
      },
    ],
  },
];

// Cross-module context interface for preserving state
export interface CrossModuleContext {
  currentModule: string;
  previousModule?: string;
  sessionData?: {
    agentMemory?: any[];
    toolResults?: any[];
    workflowState?: any[];
    knowledgeContext?: any[];
    approvalRequests?: any[];
  };
  userJourney?: {
    path: string[];
    timestamp: number;
    context: Record<string, any>;
  };
}

// Helper functions for navigation state management
export const getActiveNavItem = (pathname: string): NavigationItem | null => {
  for (const section of navigationSections) {
    for (const item of section.items) {
      if (item.href === pathname) {
        return item;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.href === pathname) {
            return child;
          }
        }
      }
    }
  }
  return null;
};

export const getNavigationBreadcrumbs = (
  pathname: string,
): NavigationItem[] => {
  const breadcrumbs: NavigationItem[] = [];

  for (const section of navigationSections) {
    for (const item of section.items) {
      if (item.href === pathname) {
        breadcrumbs.push(item);
        return breadcrumbs;
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.href === pathname) {
            breadcrumbs.push(item, child);
            return breadcrumbs;
          }
        }
      }
    }
  }

  return breadcrumbs;
};
