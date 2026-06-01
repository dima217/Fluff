import {
  useIsCheatMealDay,
} from "@/hooks/useCheatMealDay";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";

import { useDrag } from "@/contexts/DragContext";
import CheatMealCard from "./components/MealSection";
import FoodUploadCard from "./components/UploadSection";

const saladImage = require("../../assets/images/Salad.png");
const burgerImage = require("../../assets/images/Burger.png");
const burgerBackgroundImage = require("../../assets/images/OpacityBurger.png");
const saladBackgroundImage = require("../../assets/images/OpacitySalad.png");
const phoneImage = require("../../assets/images/Phone.png");
const qrImage = require("../../assets/images/Qr.png");

const Library = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const isCheatMealDay = useIsCheatMealDay();

  const { dropZoneLayout } = useDrag();
  const dropZoneRef = useRef<View>(null);

  return (
    <View style={styles.container}>
      {/* LEFT SIDE */}
      <View style={styles.leftColumn}>
        <FoodUploadCard
          title={t("library.myUploads")}
          imageSource={saladImage}
          onPress={() => router.push("/(recipe)/my-uploads")}
          backgroundImage={saladBackgroundImage}
        />
      </View>

      {/* RIGHT SIDE = DROP ZONE */}
      <View
        ref={dropZoneRef}
        style={styles.rightColumn}
        onLayout={() => {
          dropZoneRef.current?.measureInWindow((x, y, width, height) => {
            dropZoneLayout.value = { x, y, width, height };
          });
        }}
      >
        {/* CHEAT MEAL */}
        <CheatMealCard
          title={t("library.cheatMeal")}
          textHint={t("library.cheatMealHint")}
          overlayImage={burgerImage}
          backgroundImage={burgerBackgroundImage}
          onPress={() => router.push("/(app)/library/cheat-meal")}
          style={styles.bottomRightCard}
          showLock
          isUnlocked={isCheatMealDay}
        />

        {/* NOTES */}
        <CheatMealCard
          title={t("library.notes")}
          textHint={t("library.notesHint")}
          overlayImage={phoneImage}
          backgroundImage={qrImage}
          onPress={() => router.push("/(app)/library/notes")}
          style={styles.bottomRightCard}
        />
      </View>
    </View>
  );
};

export default Library;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
    flexDirection: "row",
  },
  leftColumn: {
    width: "40%",
    marginRight: 12,
  },
  rightColumn: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  bottomRightCard: {
    flex: 1,
  },
});
