import { memo, useCallback } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { MealData } from "..";
import MealCardItem from "../Cards";

export type MealsFlatListProps = {
  data: MealData[];

  onCardPress: (item: MealData) => void;
  onLikePress: (item: MealData) => void;

  horizontal?: boolean;
};

const Separator = () => <View style={{ width: 12 }} />;

const MealsFlatListComponent = ({
  data,
  onCardPress,
  onLikePress,
  horizontal = true,
}: MealsFlatListProps) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MealData>) => (
      <MealCardItem
        item={item}
        variant="list"
        onPress={onCardPress}
        onLikePress={onLikePress}
      />
    ),
    [onCardPress, onLikePress]
  );

  const keyExtractor = useCallback((item: MealData) => item.id, []);

  return (
    <FlatList
      data={data}
      horizontal={horizontal}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews
      ItemSeparatorComponent={Separator}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={2}
      getItemLayout={undefined}
    />
  );
};

export default memo(MealsFlatListComponent);
