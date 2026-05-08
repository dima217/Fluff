import { DraggableMealCard } from "@/shared/ui/Animated/DraggableMealCard";
import React from "react";
import { MealData } from "..";
import MealCard from "./MealCard";

type Props = {
  item: MealData;
  variant?: "carousel" | "list";
  isDraggable: boolean;
  dropZoneLayout?: any;
  setIsOverDropZone?: (v: boolean) => void;
  onDrop?: (item: MealData) => void;
  onPress: (item: MealData) => void;
  onLike: (item: MealData) => void;
  rightAction?: (item: MealData) => React.ReactNode;
};

const MealItem = ({
  item,
  variant = "carousel",
  isDraggable,
  dropZoneLayout,
  setIsOverDropZone,
  onDrop,
  onPress,
  onLike,
  rightAction,
}: Props) => {
  const card = (
    <MealCard
      title={item.title}
      calories={item.calories}
      imageUrl={item.imageUrl}
      onPress={() => onPress(item)}
      onLikePress={() => onLike(item)}
      variant={variant}
      status={item.status}
      isLiked={item.isLiked}
      isFluff={item.isFluff}
      rightAction={rightAction?.(item)}
    />
  );

  if (!isDraggable || !setIsOverDropZone) {
    return card;
  }

  return (
    <DraggableMealCard
      item={item}
      dropZoneLayout={dropZoneLayout}
      setIsOverDropZone={setIsOverDropZone}
      onDrop={() => onDrop?.(item)}
    >
      {card}
    </DraggableMealCard>
  );
};

export default React.memo(MealItem);
