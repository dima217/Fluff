import { memo, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import VideoPlayer from "./components/VideoPlayer";
import MediaItem from "./MediaItems";
import RecipeFetchCard from "./RecipeFetchCard";

export type VideoData = {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  videoUrl?: string | number;
};

type VideoCarouselProps = {
  data?: VideoData[];
  /** Когда задан, карточки подгружаются по id (все last visited), при нажатии открывается модалка с видео */
  recipeIds?: number[];
  onCardPress: (id: string, title: string) => void;
  style?: ViewStyle;
  variant?: "short" | "long";
  titleNumberOfLines?: number;
};

const VideoCarousel = ({
  data,
  recipeIds,
  onCardPress,
  style,
  variant = "short",
  titleNumberOfLines,
}: VideoCarouselProps) => {
  const isLongVariant = variant === "long";
  const useRecipeIds = recipeIds && recipeIds.length > 0;
  const finalData = useRecipeIds ? [] : (data ?? []);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | number>("");

  const handleRecipeCardPress = (id: string, title: string, videoUrl: string | undefined) => {
    if (videoUrl) {
      setCurrentVideoUrl(videoUrl);
      setModalVisible(true);
    }
    onCardPress(id, title);
  };

  const renderShortItem = ({ item }: ListRenderItemInfo<VideoData>) => (
    <MediaItem
      title={item.title}
      author={item.author}
      imageUrl={item.imageUrl}
      videoUrl={typeof item.videoUrl === "string" ? item.videoUrl : undefined}
      onPress={() => {
        setModalVisible(true);
        setCurrentVideoUrl(item.videoUrl || "");
        onCardPress(item.id, item.title);
      }}
      variant="short"
      titleNumberOfLines={titleNumberOfLines}
    />
  );

  const renderLongItem = (item: VideoData) => (
    <MediaItem
      key={item.id}
      title={item.title}
      author={item.author}
      imageUrl={item.imageUrl}
      videoUrl={typeof item.videoUrl === "string" ? item.videoUrl : undefined}
      onPress={() => {
        setModalVisible(true);
        setCurrentVideoUrl(item.videoUrl || "");
        onCardPress(item.id, item.title);
      }}
      variant="long"
      titleNumberOfLines={titleNumberOfLines}
    />
  );

  const renderRecipeCard = ({ item: recipeId }: ListRenderItemInfo<number>) => (
    <RecipeFetchCard
      recipeId={recipeId}
      variant={variant}
      titleNumberOfLines={titleNumberOfLines}
      onPress={(id, title, videoUrl) => {
        handleRecipeCardPress(String(id), title, videoUrl);
      }}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {useRecipeIds ? (
        isLongVariant ? (
          <View style={styles.listContentVertical}>
            {recipeIds.map((recipeId) => (
              <RecipeFetchCard
                key={recipeId}
                recipeId={recipeId}
                variant="long"
                titleNumberOfLines={titleNumberOfLines}
                onPress={(id, title, videoUrl) => {
                  handleRecipeCardPress(String(id), title, videoUrl);
                }}
              />
            ))}
          </View>
        ) : (
          <FlatList
            data={recipeIds}
            keyExtractor={(id) => String(id)}
            renderItem={renderRecipeCard}
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContentHorizontal}
          />
        )
      ) : isLongVariant ? (
        <View style={styles.listContentVertical}>
          {finalData.map(renderLongItem)}
        </View>
      ) : (
        <FlatList
          data={finalData}
          renderItem={renderShortItem}
          keyExtractor={(item) => item.id}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContentHorizontal}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <VideoPlayer
          videoUrl={currentVideoUrl}
          onClose={() => {
            setModalVisible(false);
            setCurrentVideoUrl("");
          }}
        />
      </Modal>
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
