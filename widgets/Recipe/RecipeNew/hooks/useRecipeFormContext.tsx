import { Recipe } from "@/constants/types";
import {
  FormProvider,
  useFormContext,
} from "@/contexts/FormContext/FormContext";

export const RecipeFormProvider = FormProvider<Recipe>;

export const useRecipeFormContext = () => useFormContext<Recipe>();
