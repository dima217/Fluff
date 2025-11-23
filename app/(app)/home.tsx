import AccountDetails from "@/components/AccountDetails";
import SearchInput from "@/components/Search/ui/SearchInput";
import Toogle from "@/components/Toogle";
import { Colors } from "@/constants/Colors";
import HomeContent from "@/widgets/HomeContent";
import SearchOverlayContent from "@/widgets/SearchOverlayContent";

import { useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";

// Gesture Handler + Reanimated
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Home() {
  const [toogle, setToogle] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const translateX = useSharedValue(0);

  const swipeGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX > 80 && e.velocityX > 200) {
        runOnJS(setIsSearchFocused)(false);
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const overlayAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    if (isSearchFocused) {
      translateX.value = withTiming(0, { duration: 200 });

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setIsSearchFocused(false);
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [isSearchFocused]);

  return (
    <>
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <AccountDetails />

          <SearchInput
            isFiltering={false}
            searchText=""
            selectedFilters={[]}
            onSearchChange={() => {}}
            onToggleFilter={() => {}}
            onFilterRemove={() => {}}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {}}
          />

          {!isSearchFocused && (
            <>
              <Toogle
                options={["All", "Videos", "Recipes", "Calories Base"]}
                selected={toogle}
                onSelect={setToogle}
              />
              <HomeContent selected={toogle} />
            </>
          )}
        </View>
        {isSearchFocused && (
          <GestureDetector gesture={swipeGesture}>
            <Animated.View style={[styles.overlay, overlayAnimStyle]}>
              <SearchOverlayContent />
            </Animated.View>
          </GestureDetector>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  container: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: Colors.background,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});
