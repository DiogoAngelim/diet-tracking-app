"use client";

import { useMemo } from "react";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { FoodItem } from "@/app/page";

import type { NutritionTargets } from "@/components/targets-settings";

type DailyRecommendationsProps = {
  items: FoodItem[];
  targets: NutritionTargets;
};



type NutrientStatus = "low" | "good" | "high";

function getStatus(current: number, target: number): NutrientStatus {
  const ratio = current / target;
  if (ratio < 0.5) return "low";
  if (ratio > 1.3) return "high";
  return "good";
}

function StatusIcon({ status }: { status: NutrientStatus }) {
  if (status === "low") return <TrendingDown className="h-4 w-4 text-amber-500" />;
  if (status === "high") return <TrendingUp className="h-4 w-4 text-amber-500" />;
  return <Minus className="h-4 w-4 text-primary" />;
}

function NutrientRow({
  name,
  current,
  target,
  unit,
}: {
  name: string;
  current: number;
  target: number;
  unit: string;
}) {
  const percentage = Math.min((current / target) * 100, 100);
  const status = getStatus(current, target);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <StatusIcon status={status} />
          <span className="font-medium text-card-foreground">{name}</span>
        </div>
        <span className="text-muted-foreground">
          {current.toFixed(1)} / {target} {unit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

export function DailyRecommendations({ items, targets }: DailyRecommendationsProps) {
  const dailyTargets = targets;
  const todaysTotals = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todaysItems = items.filter((item) => item.date === today);

    return {
      macros: {
        protein: todaysItems.reduce((sum, item) => sum + item.macros.protein, 0),
        carbs: todaysItems.reduce((sum, item) => sum + item.macros.carbs, 0),
        fiber: todaysItems.reduce((sum, item) => sum + item.macros.fiber, 0),
        fat: todaysItems.reduce((sum, item) => sum + item.macros.fat, 0),
      },
      micros: {
        vitaminB12: todaysItems.reduce((sum, item) => sum + item.micros.vitaminB12, 0),
        vitaminD: todaysItems.reduce((sum, item) => sum + item.micros.vitaminD, 0),
        omega3: todaysItems.reduce((sum, item) => sum + item.micros.omega3, 0),
        iron: todaysItems.reduce((sum, item) => sum + item.micros.iron, 0),
        zinc: todaysItems.reduce((sum, item) => sum + item.micros.zinc, 0),
        iodine: todaysItems.reduce((sum, item) => sum + item.micros.iodine, 0),
      },
    };
  }, [items]);

  const macroItems = [
    { name: "Protein", current: todaysTotals.macros.protein, target: dailyTargets.macros.protein, unit: "g" },
    { name: "Carbs", current: todaysTotals.macros.carbs, target: dailyTargets.macros.carbs, unit: "g" },
    { name: "Fiber", current: todaysTotals.macros.fiber, target: dailyTargets.macros.fiber, unit: "g" },
    { name: "Fat", current: todaysTotals.macros.fat, target: dailyTargets.macros.fat, unit: "g" },
  ];

  const microItems = [
    { name: "Vitamin B12", current: todaysTotals.micros.vitaminB12, target: dailyTargets.micros.vitaminB12, unit: "mcg" },
    { name: "Vitamin D", current: todaysTotals.micros.vitaminD, target: dailyTargets.micros.vitaminD, unit: "mcg" },
    { name: "Omega-3", current: todaysTotals.micros.omega3, target: dailyTargets.micros.omega3, unit: "g" },
    { name: "Iron", current: todaysTotals.micros.iron, target: dailyTargets.micros.iron, unit: "mg" },
    { name: "Zinc", current: todaysTotals.micros.zinc, target: dailyTargets.micros.zinc, unit: "mg" },
    { name: "Iodine", current: todaysTotals.micros.iodine, target: dailyTargets.micros.iodine, unit: "mg" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">This your progress. See?</CardTitle>
            <CardDescription>You are doing great, keep up!</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Macronutrients</h3>
          <div className="space-y-3">
            {macroItems.map((item) => (
              <NutrientRow key={item.name} {...item} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Key Micronutrients</h3>
          <div className="space-y-3">
            {microItems.map((item) => (
              <NutrientRow key={item.name} {...item} />
            ))}
          </div>
        </div>

        {/* Dynamic tip based on low nutrients */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            <span className="mr-1">💡</span>
            <strong>Tip:</strong> {(() => {
              // Check macros first
              const lowMacro = macroItems.find(item => item.current < item.target * 0.5);
              if (lowMacro) {
                return `Your ${lowMacro.name.toLowerCase()} intake is low today. Try adding foods rich in ${lowMacro.name.toLowerCase()}.`;
              }
              // Then micros
              const lowMicro = microItems.find(item => item.current < item.target * 0.5);
              if (lowMicro) {
                let food = '';
                switch (lowMicro.name) {
                  case 'Vitamin B12': food = 'eggs, dairy, or fish'; break;
                  case 'Vitamin D': food = 'fatty fish or fortified foods'; break;
                  case 'Omega-3': food = 'salmon, chia seeds, or walnuts'; break;
                  case 'Iron': food = 'beans, spinach, or red meat'; break;
                  default: food = 'diverse foods';
                }
                return `Your ${lowMicro.name} intake is low today. Consider adding ${food} to your meals.`;
              }
              return "You're on track! Keep up the good work.";
            })()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
