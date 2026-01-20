"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type NutritionTargets = {
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

const defaultTargets: NutritionTargets = {
  macros: { protein: 50, carbs: 300, fiber: 25, fat: 65 },
  micros: { vitaminB12: 2.4, vitaminD: 15, omega3: 1.6, iron: 18, zinc: 11, iodine: 150 },
};

export function TargetsSettings({
  value,
  onChange,
}: {
  value: NutritionTargets;
  onChange: (targets: NutritionTargets) => void;
}) {
  const [local, setLocal] = useState<NutritionTargets>(value);

  const handleMacroChange = (key: keyof NutritionTargets["macros"], val: string) => {
    setLocal((prev) => ({ ...prev, macros: { ...prev.macros, [key]: parseFloat(val) || 0 } }));
  };
  const handleMicroChange = (key: keyof NutritionTargets["micros"], val: string) => {
    setLocal((prev) => ({ ...prev, micros: { ...prev.micros, [key]: parseFloat(val) || 0 } }));
  };

  const handleSave = () => {
    onChange(local);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Nutrition Targets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Macronutrients (per day)</h4>
          {Object.entries(local.macros).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 mb-2">
              <Label className="w-24 capitalize">{key}</Label>
              <Input
                type="number"
                value={val}
                min={0}
                step={key === "fiber" ? 1 : 0.1}
                onChange={(e) => handleMacroChange(key as any, e.target.value)}
                className="w-24"
              />
              <span className="text-xs text-muted-foreground">
                {key === "protein" || key === "carbs" || key === "fiber" || key === "fat" ? "g" : ""}
              </span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="font-semibold mb-2">Micronutrients (per day)</h4>
          {Object.entries(local.micros).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 mb-2">
              <Label className="w-24 capitalize">{key}</Label>
              <Input
                type="number"
                value={val}
                min={0}
                step={0.1}
                onChange={(e) => handleMicroChange(key as any, e.target.value)}
                className="w-24"
              />
              <span className="text-xs text-muted-foreground">
                {key === "vitaminB12" || key === "vitaminD" ? "mcg" : key === "omega3" ? "g" : key === "iron" || key === "zinc" || key === "iodine" ? "mg" : ""}
              </span>
            </div>
          ))}
        </div>
        <Button onClick={handleSave} className="mt-2">Save Targets</Button>
      </CardContent>
    </Card>
  );
}

export { defaultTargets };
