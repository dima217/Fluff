export interface RecipeStep {
  id: number;
  title: string;
  description: string;
  image?: any;
}

export interface RecipeData {
  title: string;
  steps: RecipeStep[];
  id: number;
  userRating?: number | null;
}

export interface CreationStep {
  title: string;
  description: string;
  stepMediaUrl?: string;
}

export type ProductUnit = "г" | "шт";

export interface SelectedProduct {
  id: number;
  name: string;
  grams?: number;
  unit?: ProductUnit;
  calories?: number;
  image?: { cover: string; preview: string } | null;
}

export interface CustomProduct {
  name: string;
  grams?: number;
  unit?: ProductUnit;
  /** Total calories for the specified amount */
  calories?: number;
  /** Total proteins (g) for the specified amount */
  proteins?: number;
  /** Total fats (g) for the specified amount */
  fats?: number;
  /** Total carbs (g) for the specified amount */
  carbs?: number;
}

export interface Recipe {
  name: string;
  ccal: number;
  description?: string;
  selectedProducts?: SelectedProduct[];
  customProducts?: CustomProduct[];
  steps: CreationStep[];
  videoUrl: string;
  mediaUrl: string;
  /** Hours portion of cooking time */
  cookHours?: string;
  /** Minutes portion of cooking time */
  cookMinutes?: string;
  makePublic?: boolean;
  submitToSystem?: false | null;
}
