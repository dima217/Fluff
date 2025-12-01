import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { Colors } from "@/constants/Colors";
import GradientButton from "@/shared/Buttons/GradientButton";
import LongTextInput from "@/shared/Inputs/LongTextInput";
import TextInput from "@/shared/Inputs/TextInput";
import { ThemedText } from "@/shared/ui/ThemedText";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { StepProps } from "../../../constants";

const CookingProcess = ({ data, onChange, onNext, onBack }: StepProps) => {
  const steps = data.steps ?? [{ title: "Step 1", description: "" }];

  const addStep = () => {
    const newSteps = [
      ...steps,
      { title: `Step ${steps.length + 1}`, description: "" },
    ];
    onChange({ ...data, steps: newSteps });
  };

  const updateStep = (
    index: number,
    key: "title" | "description",
    value: string
  ) => {
    const newSteps = [...steps];
    newSteps[index][key] = value;
    onChange({ ...data, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);

    const renumbered = newSteps.map((step, i) => ({
      ...step,
      title: `Step ${i + 1}`,
    }));

    onChange({ ...data, steps: renumbered });
  };

  return (
    <View>
      <TouchableOpacity onPress={onBack}>
        <ArrowLeft />
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        <ThemedText type="subtitle">Cooking Process</ThemedText>
        <ThemedText type="xs">
          Break the chocolate into pieces and melt it with the butter in a
          double boiler, stirring constantly with a spatula or wooden spoon.
          Remove the resulting thick chocolate sauce from the boiler and let it
          cool.
        </ThemedText>
      </View>
      <View style={{ gap: 30 }}>
        {steps.map((step, index) => (
          <View key={index} style={{ gap: 12 }}>
            {/* Title */}
            <TextInput
              label={`Title`}
              value={step.title}
              placeholder="Enter"
              onChangeText={(text) => updateStep(index, "title", text)}
              right={
                <TouchableOpacity onPress={() => removeStep(index)}>
                  <Feather name="x" size={20} color={Colors.secondary} />
                </TouchableOpacity>
              }
            />

            {/* Description */}
            <LongTextInput
              label="Description"
              value={step.description}
              placeholder="Enter"
              onChangeText={(text) => updateStep(index, "description", text)}
            />
          </View>
        ))}
      </View>
      <GradientButton title="Add a Step" onPress={addStep} />
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    gap: 6,
    marginVertical: 30,
  },
});

export default CookingProcess;
