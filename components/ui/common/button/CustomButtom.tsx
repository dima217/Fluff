import { Colors } from "@/constants/Colors";
import { ReactNode } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { styles } from "./button.styles";

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    style: ViewStyle;
    icon?: ReactNode;
    loading?: boolean;
}

const CustomButton = ({
    title,
    onPress,
    style,
    icon,
    loading = false,
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
            style={[
                styles.button, {
                    backgroundColor: Colors.primary,
                },
            style,
        ]}
    >
         {loading ? (
            <ActivityIndicator color={Colors.primary} />
            ) : (
        <View style={styles.content}>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
        <Text style={[styles.text, {color: Colors.primary}]}>
            {title}
        </Text>
        </View>
        )}
        </TouchableOpacity>
    );
}

export default CustomButton;