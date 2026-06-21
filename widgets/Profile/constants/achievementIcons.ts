import type { AchievementCode } from "@/api/types";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import AllAchievementsIcon from "@/assets/images/achievements/all-achievements.svg";
import CreatedAccountIcon from "@/assets/images/achievements/created-account.svg";
import FirstRateIcon from "@/assets/images/achievements/first-rate.svg";
import FirstRecipeIcon from "@/assets/images/achievements/first-recipe.svg";
import PerfectMonthIcon from "@/assets/images/achievements/perfect-month.svg";
import PublicRecipeIcon from "@/assets/images/achievements/public-recipe.svg";
import TenRecipesIcon from "@/assets/images/achievements/ten-recipes.svg";

export const ACHIEVEMENT_ICON_MAP: Record<
  AchievementCode,
  ComponentType<SvgProps>
> = {
  created_account: CreatedAccountIcon,
  first_recipe: FirstRecipeIcon,
  perfect_month_tracking: PerfectMonthIcon,
  public_recipe: PublicRecipeIcon,
  ten_recipes: TenRecipesIcon,
  first_rate: FirstRateIcon,
  all_achievements: AllAchievementsIcon,
};

export const ACHIEVEMENT_ORDER: AchievementCode[] = [
  "created_account",
  "first_recipe",
  "perfect_month_tracking",
  "public_recipe",
  "ten_recipes",
  "first_rate",
  "all_achievements",
];
