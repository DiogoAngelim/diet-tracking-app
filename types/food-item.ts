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