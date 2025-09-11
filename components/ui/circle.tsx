import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureDetector } from 'react-native-gesture-handler';

interface CircleProps {
    size?: number;
    color?: string;
    onPress?: () => void;
    gesture?: any;
    svg: ReactNode;
    frostedGlass?: boolean;
}

const Circle = ({ 
    color = Colors.primary,
    size = 50,
    gesture,
    onPress,
    svg,
    frostedGlass = false,
}: CircleProps) => {

    const circleStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
    }

    if (onPress) {
        if (frostedGlass) {
            return (
                <BlurView intensity={50} tint="light" style={styles.circle}>
                    <View>
                        {svg}
                    </View>
                </BlurView>
            )
        }
        return (
            <TouchableOpacity onPress={onPress} style={[circleStyle, styles.circle]}>
                <View>
                    {svg}
                </View>
            </TouchableOpacity>
        )
    }
    
    if (gesture) {
        return (
            <GestureDetector gesture={gesture}>
                <View style={[circleStyle, styles.circle]}>
                    {svg}
                </View>
            </GestureDetector>
        )
    }
    return <View style={[circleStyle, styles.circle]}>{svg}</View>;
}

const styles = StyleSheet.create({
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    }
})

export default Circle;