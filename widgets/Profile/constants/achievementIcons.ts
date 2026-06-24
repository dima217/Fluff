import type { AchievementCode } from "@/api/types";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import AllAchievementsIcon from "@/assets/images/achievements/all-achievements.svg";
import CreatedAccountIcon from "@/assets/images/achievements/created-account.svg";
import PerfectMonthIcon from "@/assets/images/achievements/perfect-month.svg";
import TenRecipesIcon from "@/assets/images/achievements/ten-recipes.svg";

export const ACHIEVEMENT_ICON_MAP: Record<
  AchievementCode,
  ComponentType<SvgProps>
> = {
  created_account: AllAchievementsIcon,
  first_recipe: CreatedAccountIcon,
  perfect_month_tracking: PerfectMonthIcon,
  public_recipe: PerfectMonthIcon,
  ten_recipes: TenRecipesIcon,
  first_rate: TenRecipesIcon,
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
