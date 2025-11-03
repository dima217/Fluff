import { Colors } from '@/constants/Colors';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { styles } from './video.slider.styles';

const videos = [
  { id: '1', source: require('../../assets/videos/landing-2.mp4') },
  { id: '2', source: require('../../assets/videos/landing-2.mp4') },
  { id: '3', source: require('../../assets/videos/landing-3.mp4') },
];

export default function VideoSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get('window').width;
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index);
  }).current;

  const handleVideoEnd = (index: number) => {
    const nextIndex = index + 1 < videos.length ? index + 1 : 0;
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
        <View>
          <Video
            source={item.source}
            style={{ width: screenWidth, height: 250 }}
            isMuted
            shouldPlay={index === activeIndex} 
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded && status.didJustFinish) handleVideoEnd(index);
            }}
          />
           <LinearGradient
              colors={['transparent', Colors.background]} 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
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
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}
