import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1 },
    dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    dot: {
      width: 9,
      height: 9,
      borderRadius: 4.5,
      backgroundColor: Colors.inactive,
      marginHorizontal: 5,
    },
    activeDot: { 
      width: 25,
      height: 9,
      borderRadius: 4.5,
      backgroundColor: Colors.primary,
    },
})