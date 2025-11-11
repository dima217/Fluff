import { memo } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import MediaItem from "./MediaItems";
import { MOCK_VIDEO_DATA } from "./mock";

export type VideoData = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
};

type VideoCarouselProps = {
  data?: VideoData[];
  onCardPress: (id: string, title: string) => void;
  style?: ViewStyle;
  variant?: "short" | "long";
};

const renderShortItem = (
  { item }: ListRenderItemInfo<VideoData>,
  onCardPress: (id: string, title: string) => void
) => (
  <MediaItem
    title={item.title}
    author={item.author}
    imageUrl={item.imageUrl}
    onPress={() => onCardPress(item.id, item.title)}
    variant="short"
  />
);

const renderLongItem = (
  item: VideoData,
  onCardPress: (id: string, title: string) => void
) => (
  <MediaItem
    key={item.id}
    title={item.title}
    author={item.author}
    imageUrl={item.imageUrl}
    onPress={() => onCardPress(item.id, item.title)}
    variant="long"
  />
);

const VideoCarousel = ({
  data,
  onCardPress,
  style,
  variant = "short",
}: VideoCarouselProps) => {
  const isLongVariant = variant === "long";
  const finalData = data || MOCK_VIDEO_DATA;

  const getRenderItem = (props: ListRenderItemInfo<VideoData>) => {
    return renderShortItem(props, onCardPress);
  };

  if (isLongVariant) {
    return (
      <View style={[styles.container, styles.listContentVertical, style]}>
        {finalData.map((item) => renderLongItem(item, onCardPress))}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={finalData}
        renderItem={getRenderItem}
        keyExtractor={(item) => item.id}
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentHorizontal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  listContentHorizontal: {
    gap: 15,
  },
  listContentVertical: {
    gap: 20,
  },
});

export default memo(VideoCarousel);
