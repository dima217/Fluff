import { Recipe } from "@/constants/types";

export interface StepProps {
  data: Partial<Recipe>;
  onChange: (patch: Partial<Recipe>) => void;
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
}
