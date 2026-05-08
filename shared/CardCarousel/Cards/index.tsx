import React from "react";
import { MealData } from "..";
import MealCard from "./MealCard";

export type MealCardItemProps = {
  item: MealData;

  onPress: (item: MealData) => void;
  onLikePress: (item: MealData) => void;

  rightAction?: (item: MealData) => React.ReactNode;

  variant?: "carousel" | "list";
};

const MealCardItemComponent = ({
  item,
  onPress,
  onLikePress,
  rightAction,
  variant = "carousel",
}: MealCardItemProps) => {
  const handlePress = React.useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  const handleLikePress = React.useCallback(() => {
    onLikePress(item);
  }, [onLikePress, item]);

  const right = React.useMemo(() => {
    return rightAction?.(item);
  }, [rightAction, item]);

  return (
    <MealCard
      title={item.title}
      calories={item.calories}
      imageUrl={item.imageUrl}
      onPress={handlePress}
      onLikePress={handleLikePress}
      isLiked={item.isLiked}
      status={item.status}
      isFluff={item.isFluff}
      rightAction={right}
      variant={variant}
    />
  );
};

const MealCardItem = React.memo(MealCardItemComponent);

MealCardItem.displayName = "MealCardItem";

export default MealCardItem;
