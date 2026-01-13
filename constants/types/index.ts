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

export interface CreationStep {
  title: string;
  description: string;
  stepMediaUrl?: string;
}

export interface Recipe {
  name: string;
  ccal: number;
  ingredients: string;
  steps: CreationStep[];
  videoUrl: string;
  mediaUrl: string;
}
