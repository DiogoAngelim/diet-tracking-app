"use client";

import { useState, useMemo } from "react";
import { Trash2, Filter, ChevronDown, ChevronUp, Search, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { FoodItem } from "@/app/page";

type ItemTableProps = {
  items: FoodItem[];
  onRemoveItem: (id: string) => void;
};

export function ItemTable({ items, onRemoveItem }: ItemTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search term
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Date range
      const itemDate = new Date(item.date);
      if (dateFrom && itemDate < dateFrom) return false;
      if (dateTo && itemDate > dateTo) return false;
      // Price range
      if (priceMin && item.price < parseFloat(priceMin)) return false;
      if (priceMax && item.price > parseFloat(priceMax)) return false;
      return true;
    });
  }, [items, searchTerm, dateFrom, dateTo, priceMin, priceMax]);

  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setPriceMin("");
    setPriceMax("");
  };

  const hasFilters = searchTerm || dateFrom || dateTo || priceMin || priceMax;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">View your entries</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasFilters && (
              <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                !
              </span>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 rounded-lg bg-muted/50 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">From when?</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "mt-1 w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs">Till when?</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "mt-1 w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "MMM d, yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="value-min" className="text-xs">Min Value ($)</Label>
                <Input
                  id="value-min"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={priceMin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceMin(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="value-max" className="text-xs">Max Value ($)</Label>
                <Input
                  id="value-max"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="∞"
                  value={priceMax}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceMax(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {/* Items List */}
        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {items.length === 0
                ? "No items recorded yet. Start by adding your first meal!"
                : "No items match your filters."}
            </p>
          ) : (
            filteredItems.map((item) => (
              <Collapsible
                key={item.id}
                open={expandedItem === item.id}
                onOpenChange={(open) => setExpandedItem(open ? item.id : null)}
              >
                <div className="rounded-lg border bg-card">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">{item.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      {expandedItem === item.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t px-3 pb-3 pt-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="mb-1 font-medium text-muted-foreground">Macros</p>
                          <div className="space-y-0.5 text-card-foreground">
                            <p>Protein: {item.macros.protein}g</p>
                            <p>Carbs: {item.macros.carbs}g</p>
                            <p>Fiber: {item.macros.fiber}g</p>
                            <p>Fat: {item.macros.fat}g</p>
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 font-medium text-muted-foreground">Micros</p>
                          <div className="space-y-0.5 text-card-foreground">
                            <p>B12: {item.micros.vitaminB12}mcg</p>
                            <p>Vit D: {item.micros.vitaminD}mcg</p>
                            <p>Omega-3: {item.micros.omega3}g</p>
                            <p>Iron: {item.micros.iron}mg</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Item
                      </Button>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))
          )}
        </div>

        {filteredItems.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Showing {filteredItems.length} of {items.length} items
          </p>
        )}
      </CardContent>
    </Card>
  );
}
