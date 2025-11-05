import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 25,
      overflow: 'hidden',
      height: 50,
    },
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
    },
  });