import { StyleSheet, View } from "react-native";
import CheatMealCard from "./MealSection";
import FoodUploadCard from "./UploadSection";

const saladImage = require("../../assets/images/Burger.png");
const burgerImage = require("../../assets/images/Burger.png");

const Library = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <FoodUploadCard
          title="My Uploads"
          imageSource={saladImage}
          onPress={() => console.log("Tapped My Uploads")}
        />
      </View>

      <View style={styles.rightColumn}>
        <CheatMealCard
          title="Cheat Meal"
          textHint="Drag a favorite item here, open it in cheat meal day"
          overlayImage={burgerImage}
          onPress={() => console.log("Tapped Cheat Meal")}
          style={styles.bottomRightCard}
        />

        <CheatMealCard
          title="Cheat Meal"
          textHint="Drag a favorite item here, open it in cheat meal day"
          overlayImage={burgerImage}
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
    marginBottom: 25,
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
