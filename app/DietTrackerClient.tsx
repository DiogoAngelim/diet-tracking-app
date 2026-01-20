"use client";

import { useState } from "react";
import { HomeScreen } from "@/components/home-screen";
import { BudgetTracker } from "@/components/budget-tracker";
import ReceiptScanner from "@/components/receipt-scanner";
import { NutrientInput } from "@/components/nutrient-input";
import { ItemTable } from "@/components/item-table";
import { DailyRecommendations } from "@/components/daily-recommendations";
import { NutrientCharts } from "@/components/nutrient-charts";
import { TargetsSettings, defaultTargets, NutritionTargets } from "@/components/targets-settings";
import { NotificationsPanel } from "../components/notifications-panel";
import { NotificationProvider, useNotifications } from "../components/notifications-context";
import useNotify from "../hooks/use-notify";
import { BottomNavigation } from "@/components/bottom-navigation";

export type FoodItem = {
  id: string;
  date: string;
  name: string;
  price: number;
  macros: {
    protein: number;
    carbs: number;
    fiber: number;
    fat: number;
  };
  micros: {
    vitaminB12: number;
    vitaminD: number;
    omega3: number;
    iron: number;
    zinc: number;
    iodine: number;
  };
};

// Notification type is now managed by the global notification context

const initialItems: FoodItem[] = [];


export default function DietTrackerClient() {
  return (
    <NotificationProvider>
      <DietTrackerClientInner />
    </NotificationProvider>
  );
}

function DietTrackerClientInner() {
  const [activeTab, setActiveTab] = useState<"home" | "record" | "charts" | "alerts" | "targets">("home");
  const [items, setItems] = useState<FoodItem[]>(initialItems);
  const [weeklyBudget, setWeeklyBudget] = useState(150);
  const [targets, setTargets] = useState<NutritionTargets>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nutritionTargets");
      if (saved) return JSON.parse(saved);
    }
    return defaultTargets;
  });
  const { notifications, markAsRead } = useNotifications();
  const notify = useNotify();

  const addItem = (item: Omit<FoodItem, "id">) => {
    const newItem: FoodItem = { ...item, id: Date.now().toString() };
    setItems((prev) => [newItem, ...prev]);
    notify({
      title: "Item logged!",
      message: `${item.name} has been added to your entries.`,
      type: "info"
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTargetsChange = (newTargets: NutritionTargets) => {
    setTargets(newTargets);
    if (typeof window !== "undefined") {
      localStorage.setItem("nutritionTargets", JSON.stringify(newTargets));
    }
    notify({
      title: "Targets updated",
      message: "Your nutrition targets have been saved.",
      type: "success"
    });
  };

  const totalSpent = items
    .filter((item) => {
      const itemDate = new Date(item.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return itemDate >= weekAgo;
    })
    .reduce((sum, item) => sum + item.price, 0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto max-w-lg px-4 py-6">
        {activeTab === "home" && (
          <div className="space-y-6">
            <HomeScreen
              userName="Friend"
              mealsToday={items.filter(i => i.date === new Date().toISOString().split('T')[0]).length}
              caloriesToday={items.filter(i => i.date === new Date().toISOString().split('T')[0]).reduce((sum, i) => sum + (i.macros?.carbs || 0) * 4 + (i.macros?.protein || 0) * 4 + (i.macros?.fat || 0) * 9, 0)}
              proteinToday={items.filter(i => i.date === new Date().toISOString().split('T')[0]).reduce((sum, i) => sum + (i.macros?.protein || 0), 0)}
            />
            <BudgetTracker
              budget={weeklyBudget}
              spent={totalSpent}
              onBudgetChange={setWeeklyBudget}
            />
            <ReceiptScanner onItemExtracted={addItem} />
            <DailyRecommendations items={items} targets={targets} />
          </div>
        )}
        {activeTab === "targets" && (
          <TargetsSettings value={targets} onChange={handleTargetsChange} />
        )}

        {activeTab === "record" && (
          <div className="space-y-6">
            <NutrientInput onAddItem={addItem} />
            <ItemTable items={items} onRemoveItem={removeItem} />
          </div>
        )}

        {activeTab === "charts" && <NutrientCharts items={items} targets={targets} />}

        {activeTab === "alerts" && (
          <NotificationsPanel />
        )}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={unreadCount}
        tabsOverride={[
          { id: "home", label: "Home" },
          { id: "record", label: "Record" },
          { id: "charts", label: "Charts" },
          { id: "alerts", label: "Alerts" },
          { id: "targets", label: "Targets" },
        ]}
      />
    </div>
  );
}
