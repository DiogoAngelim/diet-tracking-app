"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import type { FoodItem } from "@/app/page";

type NutrientChartsProps = {
  items: FoodItem[];
};

const COLORS = {
  primary: "hsl(145, 63%, 42%)",
  secondary: "hsl(200, 60%, 50%)",
  accent: "hsl(85, 70%, 55%)",
  warning: "hsl(45, 93%, 47%)",
  danger: "hsl(25, 80%, 50%)",
};



import type { NutritionTargets } from "@/components/targets-settings";

type Props = NutrientChartsProps & { targets: NutritionTargets };

export function NutrientCharts({ items, targets }: Props) {
  const [activeChart, setActiveChart] = useState<"macros" | "micros" | "trends" | "risks">("macros");
  const dailyTargets = targets;

  const weeklyData = useMemo(() => {
    const days: { [key: string]: FoodItem[] } = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      days[dateStr] = items.filter((item) => item.date === dateStr);
    }

    return Object.entries(days).map(([date, dayItems]) => {
      const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });
      return {
        date,
        day: dayName,
        protein: dayItems.reduce((sum, item) => sum + item.macros.protein, 0),
        carbs: dayItems.reduce((sum, item) => sum + item.macros.carbs, 0),
        fiber: dayItems.reduce((sum, item) => sum + item.macros.fiber, 0),
        fat: dayItems.reduce((sum, item) => sum + item.macros.fat, 0),
        vitaminB12: dayItems.reduce((sum, item) => sum + item.micros.vitaminB12, 0),
        vitaminD: dayItems.reduce((sum, item) => sum + item.micros.vitaminD, 0),
        omega3: dayItems.reduce((sum, item) => sum + item.micros.omega3, 0),
        iron: dayItems.reduce((sum, item) => sum + item.micros.iron, 0),
      };
    });
  }, [items]);

  const macroDistribution = useMemo(() => {
    const totals = items.reduce(
      (acc, item) => ({
        protein: acc.protein + item.macros.protein * 4,
        carbs: acc.carbs + item.macros.carbs * 4,
        fat: acc.fat + item.macros.fat * 9,
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    const total = totals.protein + totals.carbs + totals.fat;

    return [
      { name: "Protein", value: totals.protein, percentage: total ? ((totals.protein / total) * 100).toFixed(1) : "0" },
      { name: "Carbs", value: totals.carbs, percentage: total ? ((totals.carbs / total) * 100).toFixed(1) : "0" },
      { name: "Fat", value: totals.fat, percentage: total ? ((totals.fat / total) * 100).toFixed(1) : "0" },
    ];
  }, [items]);

  const riskAssessment = useMemo(() => {
    const weekTotal = weeklyData.reduce(
      (acc, day) => ({
        protein: acc.protein + day.protein,
        fiber: acc.fiber + day.fiber,
        vitaminB12: acc.vitaminB12 + day.vitaminB12,
        vitaminD: acc.vitaminD + day.vitaminD,
        omega3: acc.omega3 + day.omega3,
        iron: acc.iron + day.iron,
      }),
      { protein: 0, fiber: 0, vitaminB12: 0, vitaminD: 0, omega3: 0, iron: 0 }
    );

    const weeklyTargets = {
      protein: dailyTargets.macros.protein * 7,
      fiber: dailyTargets.macros.fiber * 7,
      vitaminB12: dailyTargets.micros.vitaminB12 * 7,
      vitaminD: dailyTargets.micros.vitaminD * 7,
      omega3: dailyTargets.micros.omega3 * 7,
      iron: dailyTargets.micros.iron * 7,
    };

    return [
      { name: "Protein", actual: weekTotal.protein, target: weeklyTargets.protein, status: weekTotal.protein >= weeklyTargets.protein * 0.8 ? "good" : weekTotal.protein >= weeklyTargets.protein * 0.5 ? "warning" : "risk" },
      { name: "Fiber", actual: weekTotal.fiber, target: weeklyTargets.fiber, status: weekTotal.fiber >= weeklyTargets.fiber * 0.8 ? "good" : weekTotal.fiber >= weeklyTargets.fiber * 0.5 ? "warning" : "risk" },
      { name: "Vitamin B12", actual: weekTotal.vitaminB12, target: weeklyTargets.vitaminB12, status: weekTotal.vitaminB12 >= weeklyTargets.vitaminB12 * 0.8 ? "good" : weekTotal.vitaminB12 >= weeklyTargets.vitaminB12 * 0.5 ? "warning" : "risk" },
      { name: "Vitamin D", actual: weekTotal.vitaminD, target: weeklyTargets.vitaminD, status: weekTotal.vitaminD >= weeklyTargets.vitaminD * 0.8 ? "good" : weekTotal.vitaminD >= weeklyTargets.vitaminD * 0.5 ? "warning" : "risk" },
      { name: "Omega-3", actual: weekTotal.omega3, target: weeklyTargets.omega3, status: weekTotal.omega3 >= weeklyTargets.omega3 * 0.8 ? "good" : weekTotal.omega3 >= weeklyTargets.omega3 * 0.5 ? "warning" : "risk" },
      { name: "Iron", actual: weekTotal.iron, target: weeklyTargets.iron, status: weekTotal.iron >= weeklyTargets.iron * 0.8 ? "good" : weekTotal.iron >= weeklyTargets.iron * 0.5 ? "warning" : "risk" },
    ];
  }, [weeklyData]);

  const pieColors = [COLORS.primary, COLORS.secondary, COLORS.accent];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Nutrition Insights</h1>
        <p className="text-sm text-muted-foreground">
          Visualize your nutritional journey
        </p>
      </div>

      <Tabs value={activeChart} onValueChange={(v) => setActiveChart(v as typeof activeChart)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="macros">Macros</TabsTrigger>
          <TabsTrigger value="micros">Micros</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="macros" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Calorie Distribution</CardTitle>
              <CardDescription>Breakdown by macronutrient</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  No data yet. Add foods to see your calorie distribution.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        labelLine={false}
                      >
                        {macroDistribution.map((entry, index) => (
                          <Cell key={`cell-${entry.name}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(0)} cal`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Macros</CardTitle>
              <CardDescription>Past 7 days breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  No data yet. Add foods to see your daily macros.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="protein" name="Protein (g)" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="carbs" name="Carbs (g)" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="fat" name="Fat (g)" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="micros" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Micronutrient Intake</CardTitle>
              <CardDescription>Weekly overview</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
                  No data yet. Add foods to see your micronutrient intake.
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="iron" name="Iron (mg)" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="vitaminD" name="Vitamin D (mcg)" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="omega3" name="Omega-3 (g)" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Protein Trend</CardTitle>
              <CardDescription>Daily protein intake over time</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  No data yet. Add foods to see your protein trend.
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="protein"
                        name="Protein (g)"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        dot={{ fill: COLORS.primary, strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="fiber"
                        name="Fiber (g)"
                        stroke={COLORS.secondary}
                        strokeWidth={2}
                        dot={{ fill: COLORS.secondary, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Deficiency Risk Assessment</CardTitle>
              <CardDescription>Weekly progress vs. recommended intake</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  No data yet. Add foods to see your deficiency risk assessment.
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {riskAssessment.map((item) => {
                      const percentage = Math.min((item.actual / item.target) * 100, 100);
                      return (
                        <div key={item.name} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "good"
                                ? "bg-primary/10 text-primary"
                                : item.status === "warning"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-destructive/10 text-destructive"
                                }`}>
                                {item.status === "good" ? "On Track" : item.status === "warning" ? "Low" : "Deficient"}
                              </span>
                              <span className="text-muted-foreground">
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full transition-all ${item.status === "good"
                                ? "bg-primary"
                                : item.status === "warning"
                                  ? "bg-amber-500"
                                  : "bg-destructive"
                                }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-lg bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="mr-1">📊</span>
                      <strong>Summary:</strong> {riskAssessment.filter(r => r.status === "risk").length} nutrients need attention.
                      Focus on {riskAssessment.filter(r => r.status === "risk").map(r => r.name).join(", ") || "maintaining your current intake"}.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
