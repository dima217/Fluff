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
