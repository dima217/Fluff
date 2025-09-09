import { ThemedText } from "@/components/ui/ThemedText";
import VideoSlider from "@/components/ui/video/videoSlider";
import React from "react";
import { View } from "react-native";
import Cutlery from '../assets/images/Cutlery.svg';

const onboardingScreen = () => {
    return (
        <View>
            <VideoSlider/>
            <View>
                <Cutlery/>
                <ThemedText type="title">
                    Culinary Constructor
                </ThemedText>
            </View>

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
