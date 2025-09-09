import { ThemedText } from "@/components/ui/ThemedText";
import VideoSlider from "@/components/ui/video/videoSlider";
import React from "react";
import { View } from "react-native";

const onboardingScreen = () => {
    return (
        <View>
            <VideoSlider/>
            <ThemedText type="title">
                Culinary Constructor
            </ThemedText>
            <ThemedText type="title">
                A Sound Mind
                In a Sound Body
            </ThemedText>
            <ThemedText type="subtitle">
                Track your daily dietary norms without much effort
            </ThemedText>
        </View>
    );
}

export default onboardingScreen;
