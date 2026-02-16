import EditIcon from "@/assets/images/Edit_fill.svg";
import Heart from "@/assets/images/Heart.svg";
import { Colors } from "@/constants/design-tokens";
import { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import type { MealData } from "./index";

/** Дефолтная иконка справа на карточке — лайк (не меняет текущую структуру) */
export function renderDefaultCardAction(
  item: MealData,
  isLiked: boolean,
  onLikePress?: () => void
): ReactNode {
  const strokeColor = isLiked ? Colors.primary : "#8B868F";
  const fillColor = isLiked ? Colors.primary : "none";

  return (
    <TouchableOpacity
      onPress={(e) => {
        e?.stopPropagation?.();
        onLikePress?.();
      }}
      activeOpacity={0.7}
    >
      <Heart
        width={24}
        height={24}
        stroke={strokeColor}
        fill={fillColor}
        strokeWidth={1}
      />
    </TouchableOpacity>
  );
}

interface EditRecipeCardActionProps {
  item: MealData;
  onEdit: (item: MealData) => void;
}

/** Иконка редактирования — переход на экран обновления рецепта */
export function EditRecipeCardAction({
  item,
  onEdit,
}: EditRecipeCardActionProps): ReactNode {
  return (
    <TouchableOpacity
      onPress={(e) => {
        e?.stopPropagation?.();
        onEdit(item);
      }}
      activeOpacity={0.7}
      hitSlop={12}
    >
      <EditIcon width={22} height={22} fill={Colors.border} />
    </TouchableOpacity>
  );
}
