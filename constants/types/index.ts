export interface RecipeStep {
  id: number;
  title: string;
  description: string;
  image?: any;
}

export interface RecipeData {
  title: string;
  steps: RecipeStep[];
}

export interface Recipe {
  name: string;
  ccal: number;
  ingridients: string[];
  title: string;
  description: string;
}
