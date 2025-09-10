import { Colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureDetector } from 'react-native-gesture-handler';

interface CircleProps {
    size?: number;
    color?: string;
    onPress?: () => void;
    gesture?: any;
    svg: ReactNode
}

const Circle = ({ 
    color = Colors.primary,
    size = 50,
    gesture,
    onPress,
    svg,
}: CircleProps) => {

    const circleStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
    }

    if (onPress) {
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