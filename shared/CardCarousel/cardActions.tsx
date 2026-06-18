import Heart from "@/assets/images/Heart.svg";
import { useColors } from "@/contexts/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/shared/ui/ThemedText";
import type { MealData } from "./index";

export function DefaultCardAction({
  item,
  isLiked,
  onLikePress,
}: {
  item: MealData;
  isLiked: boolean;
  onLikePress?: () => void;
}): ReactNode {
  const colors = useColors();
  const strokeColor = isLiked ? colors.primary : colors.iconMuted;
  const fillColor = isLiked ? colors.primary : "none";

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

/** @deprecated Use DefaultCardAction component */
export function renderDefaultCardAction(
  item: MealData,
  isLiked: boolean,
  onLikePress?: () => void
): ReactNode {
  return (
    <DefaultCardAction item={item} isLiked={isLiked} onLikePress={onLikePress} />
  );
}

interface EditRecipeCardActionProps {
  item: MealData;
  onEdit: (item: MealData) => void;
}

export function EditRecipeCardAction({
  item,
  onEdit,
}: EditRecipeCardActionProps): ReactNode {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={(e) => {
        e?.stopPropagation?.();
        onEdit(item);
      }}
      activeOpacity={0.7}
      hitSlop={12}
    >
      <Feather name="edit" size={18} color={colors.text} />
    </TouchableOpacity>
  );
}

interface DeleteRecipeCardActionProps {
  item: MealData;
  onDelete: (item: MealData) => void;
}

export function DeleteRecipeCardAction({
  item,
  onDelete,
}: DeleteRecipeCardActionProps): ReactNode {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={(e) => {
        e?.stopPropagation?.();
        onDelete(item);
      }}
      activeOpacity={0.7}
      hitSlop={12}
      style={styles.deleteAction}
    >
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={22}
        color={colors.border}
      />
    </TouchableOpacity>
  );
}

interface AddProductCardActionProps {
  label: string;
  added?: boolean;
  onAdd: () => void;
}

export function AddProductCardAction({
  label,
  added = false,
  onAdd,
}: AddProductCardActionProps): ReactNode {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={(e) => {
        e?.stopPropagation?.();
        onAdd();
      }}
      activeOpacity={0.8}
      style={[
        styles.addBtn,
        { backgroundColor: added ? colors.inactive : colors.primary },
      ]}
    >
      <ThemedText type="xs" style={{ color: colors.onPrimary, fontWeight: "600" }}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    marginLeft: 4,
  },
  addBtn: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
