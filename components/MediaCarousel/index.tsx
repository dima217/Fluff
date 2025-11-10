import { memo } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import MediaItem from "./MediaItems";

const MOCK_IMAGE_URL =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop";

const MOCK_VIDEO_DATA: VideoData[] = [
  {
    id: "mock_v1",
    title: "Breakfast",
    author: "Mock Author 1",
    imageUrl: MOCK_IMAGE_URL,
  },
  {
    id: "mock_v2",
    title: "Pasta",
    author: "Mock Author 2",
    imageUrl:
      "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "mock_v3",
    title: "Launch",
    author: "Mock Author 3",
    imageUrl:
      "https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "mock_v4",
    title: "Gorgeous Burger",
    author: "Mock Author 4",
    imageUrl:
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];
// -

// Тип данных для одного видео
type VideoData = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
};

type VideoCarouselProps = {
  data?: VideoData[];
  onCardPress: (id: string, title: string) => void;
  style?: ViewStyle;
};

const renderItem = (
  { item }: ListRenderItemInfo<VideoData>,
  onCardPress: (id: string, title: string) => void
) => (
  <MediaItem
    title={item.title}
    author={item.author}
    imageUrl={item.imageUrl}
    onPress={() => onCardPress(item.id, item.title)}
  />
);

const VideoCarousel = ({ data, onCardPress, style }: VideoCarouselProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data || MOCK_VIDEO_DATA}
        renderItem={(props) => renderItem(props, onCardPress)}
        keyExtractor={(item) => item.id}
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
});

export default memo(VideoCarousel);
