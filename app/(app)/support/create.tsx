import { useTranslation } from "@/hooks/useTranslation";
import Header from "@/shared/Header";
import KeyboardAwareView from "@/shared/KeyboardAwareView";
import View from "@/shared/View";
import SupportRequest from "@/widgets/Support/forms/SupportRequest";
import { ScrollView, StyleSheet } from "react-native";

const SupportCreate = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Header title={t("support.reportProblem")} />
      <KeyboardAwareView style={styles.keyboard}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SupportRequest />
        </ScrollView>
      </KeyboardAwareView>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    paddingBottom: 40,
  },
});

export default SupportCreate;
