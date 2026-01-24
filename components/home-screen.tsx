"use client";

import { Leaf, Sun, Moon } from "lucide-react";

type HomeScreenProps = {
  userName: string;
  mealsToday: number;
  caloriesToday: number;
  proteinToday: number;
};

export function HomeScreen({ userName, mealsToday, caloriesToday, proteinToday }: HomeScreenProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const Icon = hour < 12 ? Sun : hour < 18 ? Sun : Moon;

  return (
    <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{greeting}</span>
          </div>
          <h1 className="text-2xl font-semibold text-balance">
            Welcome back, {userName}!
          </h1>
          <p className="text-sm text-primary-foreground/80 text-pretty">
            Ready to nourish your body today? Let&apos;s track your meals together.
          </p>
        </div>
        <div className="rounded-full bg-primary-foreground/20 p-3">
          <Leaf className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <QuickStat label="Today's Meals" value={mealsToday.toString()} />
        <QuickStat label="Calories" value={caloriesToday.toLocaleString()} />
        <QuickStat label="Protein" value={proteinToday.toLocaleString() + 'g'} />
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-primary-foreground/10 backdrop-blur-sm p-3 text-center border border-primary-foreground/20">
      <p className="text-lg font-semibold text-primary-foreground">{value}</p>
      <p className="text-xs text-primary-foreground/80">{label}</p>
    </div>
  );
}
