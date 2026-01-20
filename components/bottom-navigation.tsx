"use client";

import React from "react"

import { Home, ClipboardList, BarChart2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "home" | "record" | "charts" | "alerts" | "targets";

type BottomNavigationProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  unreadCount: number;
  tabsOverride?: { id: Tab; label: string }[];
};

const iconMap: Record<Tab, React.ElementType> = {
  home: Home,
  record: ClipboardList,
  charts: BarChart2,
  alerts: Bell,
  targets: BarChart2, // You can pick a better icon if desired
};

export function BottomNavigation({
  activeTab,
  onTabChange,
  unreadCount,
  tabsOverride,
}: BottomNavigationProps) {
  const tabs = tabsOverride || [
    { id: "home", label: "Home" },
    { id: "record", label: "Record" },
    { id: "charts", label: "Charts" },
    { id: "alerts", label: "Alerts" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto max-w-lg">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = iconMap[tab.id];
            const isActive = activeTab === tab.id;
            const showBadge = tab.id === "alerts" && unreadCount > 0;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-1 py-2 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {showBadge && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
}
