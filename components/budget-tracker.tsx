"use client";

import { useState } from "react";
import { Wallet, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type BudgetTrackerProps = {
  budget: number;
  spent: number;
  onBudgetChange: (budget: number) => void;
};

export function BudgetTracker({ budget, spent, onBudgetChange }: BudgetTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(budget.toString());

  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;
  const isOverBudget = remaining < 0;

  const handleSave = () => {
    const newBudget = parseFloat(editValue);
    if (!isNaN(newBudget) && newBudget > 0) {
      onBudgetChange(newBudget);
    }
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-accent p-2">
            <Wallet className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-card-foreground">Weekly Budget</h2>
            <p className="text-sm text-muted-foreground">Track your food spending</p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={editValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
              className="h-8 w-20 text-right"
              min="0"
              step="10"
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => {
              setEditValue(budget.toString());
              setIsEditing(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Spent this week</p>
            <p className="text-2xl font-bold text-card-foreground">${spent.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Budget</p>
            <p className="text-lg font-semibold text-card-foreground">${budget.toFixed(2)}</p>
          </div>
        </div>

        <Progress value={percentage} className="h-3" />

        <div className="flex items-center justify-between text-sm">
          <span
            className={
              isOverBudget ? "font-medium text-destructive" : "text-muted-foreground"
            }
          >
            {isOverBudget
              ? `Over budget by $${Math.abs(remaining).toFixed(2)}`
              : `$${remaining.toFixed(2)} remaining`}
          </span>
          <span className="text-muted-foreground">{percentage.toFixed(0)}% used</span>
        </div>
      </div>
    </div>
  );
}
