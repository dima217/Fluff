import Header from "@/shared/Header";
import View from "@/shared/View";
import SupportRequest from "@/widgets/Support/forms/SupportRequest";
import { ScrollView, StyleSheet } from "react-native";

const Support = () => {
  return (
    <View>
      <Header title="Support" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <SupportRequest />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    paddingBottom: 40,
  },
  empty: {
    opacity: 0.8,
    marginTop: 20,
  },
});


export default Support;
