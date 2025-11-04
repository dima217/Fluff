import { Colors } from "@/constants/Colors";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import { styles } from "./video.slider.styles";

const videos = [
  { id: "1", source: require("../../assets/videos/landing-1.mp4") },
  { id: "2", source: require("../../assets/videos/landing-2.mp4") },
  { id: "3", source: require("../../assets/videos/landing-3.mp4") },
];

type VideoRef = { [key: string]: Video | null };

export default function VideoSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<VideoRef>({});

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;

      if (videoRefs.current[activeIndex] && activeIndex !== newIndex) {
        videoRefs.current[activeIndex]?.setPositionAsync(0);
      }
      setActiveIndex(newIndex);
    }
  }).current;

  const handleVideoEnd = (index: number) => {
    const nextIndex = index + 1 < videos.length ? index + 1 : 0;
    videoRefs.current[index]?.setPositionAsync(0);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={{ width: screenWidth, height: "100%" }}>
            <Video
              ref={(ref) => {
                videoRefs.current[index] = ref;
              }}
              source={item.source}
              style={{ width: "100%", height: "100%" }}
              resizeMode={ResizeMode.COVER}
              isMuted
              shouldPlay={index === activeIndex}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded && status.didJustFinish)
                  handleVideoEnd(index);
              }}
            />
            <LinearGradient
              colors={["transparent", Colors.background]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 450,
              }}
            />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      <View style={styles.dots}>
        {videos.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}
