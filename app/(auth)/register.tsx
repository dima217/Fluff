import Age from "@/components/Screens/Age";
import Sex from "@/components/Screens/Sex";
import ProgressDots from "@/components/ui/ProgressDots";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const SpeechScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 1;

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Процесс завершен!");
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <Sex onNext={goToNextStep} />;
      case 1:
        return <Age onFinish={goToNextStep} onPrev={goToPrevStep} />;
      default:
        return (
          <View style={styles.finalView}>
            <Text style={styles.finalText}>Процесс завершен!</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ProgressDots totalSteps={totalSteps} activeIndex={currentStep} />
      {renderStepComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  finalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  finalText: {
    color: "white",
    fontSize: 22,
  },
});

export default SpeechScreen;
