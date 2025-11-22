import Button from "@/components/Button";
import SearchInput from "@/components/Search/ui/SearchInput";
import TextInput from "@/components/TextInput";
import GradientView from "@/components/ui/Gradient";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

type InputMode = "manual" | "search";

interface CalorieInputProps {
  onAdd: (foodName: string, calories: number) => void;
}

const CalorieInput: React.FC<CalorieInputProps> = ({ onAdd }) => {
  const [mode, setMode] = useState<InputMode>("manual");
  const [foodName, setFoodName] = useState<string>("");
  const [calories, setCalories] = useState<string>("");

  const handleAdd = () => {
    if (mode === "manual" && foodName && calories) {
      onAdd(foodName, parseInt(calories));
      setFoodName("");
      setCalories("");
    }
  };

  const handleToggleMode = () => {
    setMode(mode === "manual" ? "search" : "manual");
  };

  return (
    <GradientView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="xs">Daily calorie intake</ThemedText>
        <TouchableOpacity
          onPress={handleToggleMode}
          style={styles.toggleButton}
        >
          <Ionicons name="repeat" size={16} color={Colors.primary} />
          <ThemedText type="xs" style={{ color: Colors.primary }}>
            {mode === "manual" ? "Recipe from Fluff" : "Your own recipe"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        {mode === "manual" ? (
          <>
            <TextInput
              label="Food Name"
              placeholder="Example: Banana, Chicken Breast"
              value={foodName}
              onChangeText={setFoodName}
            />
            <TextInput
              label="Calories"
              placeholder="Example: 95"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
          </>
        ) : (
          <>
            <SearchInput
              style={styles.searchInput}
              isFiltering={false}
              searchText={""}
              selectedFilters={[]}
              onSearchChange={function (text: string): void {}}
              onToggleFilter={function (): void {}}
              onFilterRemove={function (filter: string): void {}}
            />
          </>
        )}
      </View>

      <Button onPress={handleAdd} title={"Add"} />
    </GradientView>
  );
};

export default CalorieInput;
