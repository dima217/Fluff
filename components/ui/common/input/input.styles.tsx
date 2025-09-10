import { StyleSheet } from "react-native";

const styles = StyleSheet.create ({
   container: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 30,
   },
   inputContainer: {
    width: 200,
    borderRadius: 10,
    height: 47,
    paddingHorizontal: 10,
    borderWidth: 2,
    justifyContent: 'center'
   },
   input: {
    fontSize: 16,
    color: '#E5E5E5',
    paddingTop: 10,
    height: '100%',
   },
   button: {
    borderWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
   },
   errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
   },
   arrow: {
     justifyContent: 'center',
     alignItems: 'center'
   },
   mainTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
   },
   textContainer: {
    display: 'flex',
    flexDirection: 'column',
  
   }
})

export default styles;