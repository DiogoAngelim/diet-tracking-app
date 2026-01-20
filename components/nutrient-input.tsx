"use client";

import React from "react";

import { useState } from "react";
import { Plus, Apple, Pill, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { FoodItem } from "@/app/page";

type NutrientInputProps = {
  onAddItem: (item: Omit<FoodItem, "id">) => void;
};

const defaultMacros = { protein: 0, carbs: 0, fiber: 0, fat: 0 };
const defaultMicros = {
  vitaminB12: 0,
  vitaminD: 0,
  omega3: 0,
  iron: 0,
  zinc: 0,
  iodine: 0,
};

export function NutrientInput({ onAddItem }: NutrientInputProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [macros, setMacros] = useState(defaultMacros);
  const [micros, setMicros] = useState(defaultMicros);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      date: format(date, "yyyy-MM-dd"),
      name: name.trim(),
      price: parseFloat(price) || 0,
      macros,
      micros,
    });

    // Reset form
    setName("");
    setPrice("");
    setDate(new Date());
    setMacros(defaultMacros);
    setMicros(defaultMicros);
  };

  const updateMacro = (key: keyof typeof macros, value: string) => {
    setMacros((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const updateMicro = (key: keyof typeof micros, value: string) => {
    setMicros((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-5 w-5 text-primary" />
          Manual entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label htmlFor="item-name">Food Name</Label>
              <Input
                id="item-name"
                placeholder="e.g., Chick peas"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="item-value">Value ($)</Label>
              <Input
                id="item-value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mt-1 w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Tabs defaultValue="macros" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="macros" className="flex items-center gap-1.5">
                <Apple className="h-4 w-4" />
                Macro
              </TabsTrigger>
              <TabsTrigger value="micros" className="flex items-center gap-1.5">
                <Pill className="h-4 w-4" />
                Micro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="macros" className="mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="protein" className="text-xs">
                    Protein (g)
                  </Label>
                  <Input
                    id="protein"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={macros.protein || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMacro("protein", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs" className="text-xs">
                    Carbs (g)
                  </Label>
                  <Input
                    id="carbs"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={macros.carbs || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMacro("carbs", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fiber" className="text-xs">
                    Fiber (g)
                  </Label>
                  <Input
                    id="fiber"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={macros.fiber || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMacro("fiber", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="fat" className="text-xs">
                    Fat (g)
                  </Label>
                  <Input
                    id="fat"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={macros.fat || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMacro("fat", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="micros" className="mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="b12" className="text-xs">
                    Vitamin B12 (mcg)
                  </Label>
                  <Input
                    id="b12"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={micros.vitaminB12 || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMicro("vitaminB12", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="vitd" className="text-xs">
                    Vitamin D (mcg)
                  </Label>
                  <Input
                    id="vitd"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={micros.vitaminD || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMicro("vitaminD", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="omega3" className="text-xs">
                    Omega-3 (g)
                  </Label>
                  <Input
                    id="omega3"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={micros.omega3 || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMicro("omega3", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="iron" className="text-xs">
                    Iron (mg)
                  </Label>
                  <Input
                    id="iron"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={micros.iron || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMicro("iron", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zinc" className="text-xs">
                    Zinc (mg)
                  </Label>
                  <Input
                    id="zinc"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={micros.zinc || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMicro("zinc", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="iodine" className="text-xs">
                    Iodine (mcg)
                  </Label>
                  <Input
                    id="iodine"
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={micros.iodine || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMicro("iodine", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full" disabled={!name.trim()}>
            <Plus className="mr-2 h-4 w-4" />
            Register
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
