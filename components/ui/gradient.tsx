import { Colors } from '@/constants/Colors';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

interface GradientViewProps {
    children: React.ReactNode;
    colors?: LinearGradientProps['colors'];
    style?: ViewStyle;
}

const GradientView = ({ 
    children, 
    colors = Colors.gradient, 
    style 
}: GradientViewProps) => {
    return (
        <LinearGradient
            colors={colors}
            style={[styles.container, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientView;