import { useTranslation } from "@/hooks/useTranslation";
import { StyleSheet, View } from "react-native";
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

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <FoodUploadCard
          title={t("library.myUploads")}
          imageSource={saladImage}
          onPress={() => console.log("Tapped My Uploads")}
          backgroundImage={saladBackgroundImage}
        />
      </View>

      <View style={styles.rightColumn}>
        <CheatMealCard
          title={t("library.cheatMeal")}
          textHint={t("library.cheatMealHint")}
          overlayImage={burgerImage}
          backgroundImage={burgerBackgroundImage}
          onPress={() => console.log("Tapped Cheat Meal")}
          style={styles.bottomRightCard}
        />

        <CheatMealCard
          title={t("library.scanner")}
          textHint={t("library.scannerHint")}
          overlayImage={phoneImage}
          backgroundImage={qrImage}
          onPress={() => console.log("Tapped Cheat Meal")}
          style={styles.bottomRightCard}
        />
      </View>
    </View>
  );
};

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

export default Library;
