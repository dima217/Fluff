import { Dimensions, StyleSheet } from "react-native";

const SWIPER_WIDTH = Dimensions.get('window').width * 0.8; 
const PADDING = 5;

export const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    swiperBar: {
      width: SWIPER_WIDTH,
      height: 70,
      backgroundColor: '#1A1A1A',
      borderRadius: 35,
      justifyContent: 'flex-start',
      padding: PADDING,
    },
    labelContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 10,
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 300,
    },
});