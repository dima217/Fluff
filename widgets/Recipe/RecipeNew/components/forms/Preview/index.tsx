import { RootState, useMediaUrl } from "@/api";
import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import { useColors } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import CheckBox from "@/shared/CheckBox";
import { ThemedText } from "@/shared/ui/ThemedText";
import IngredientsSection from "@/widgets/Recipe/RecipeInfo/components/IngredientsSection";
import { Controller, useFormContext } from "react-hook-form";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const Preview = ({ onBack }: { onBack: () => void }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const { getValues, control } = useFormContext();
  const allValues = getValues();
  const profile = useSelector((state: RootState) => state.user.profile);
  const { url: mediaUrlServer } = useMediaUrl(allValues.mediaUrl, {
    skip: !allValues.mediaUrl,
  });

  const authorName = [profile?.user.firstName, profile?.user.lastName]
    .filter(Boolean)
    .join(" ");
  const description = allValues.description?.trim();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <ThemedText type="subtitle">{t("recipe.review")}</ThemedText>
        <ThemedText type="xs">{t("recipe.reviewHint")}</ThemedText>
      </View>

      <Image
        style={styles.coverImage}
        source={{ uri: allValues.mediaUrl?.startsWith("file://") ? allValues.mediaUrl : mediaUrlServer ? mediaUrlServer : allValues.mediaUrl ?? "" }}
      />

      <View style={styles.details}>
        <View style={styles.titleBlock}>
          <ThemedText type="subtitle">{allValues.name}</ThemedText>
          {authorName ? (
            <ThemedText type="xs" style={styles.author}>
              {authorName}
            </ThemedText>
          ) : null}
        </View>

        {description ? (
          <ThemedText style={styles.description}>{description}</ThemedText>
        ) : null}

        <IngredientsSection products={allValues.ingredients} dense />

        <View style={styles.checkboxes}>
          <Controller
            control={control}
            name="makePublic"
            render={({ field: { value, onChange } }) => (
              <CheckBox
                title={t("recipe.makePublic")}
                checked={value}
                setChecked={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="submitToSystem"
            render={({ field: { value, onChange } }) => (
              <CheckBox
                title={t("recipe.submitToSystem")}
                checked={value}
                allowNull
                setChecked={onChange}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  backButton: {
    paddingBottom: 10,
  },
  header: {
    gap: 6,
    marginBottom: 16,
  },
  coverImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
  },
  details: {
    marginTop: 12,
  },
  titleBlock: {
    gap: 8,
  },
  author: {
    opacity: 0.7,
  },
  description: {
    marginTop: 8,
  },
  checkboxes: {
    marginTop: 20,
    gap: 16,
  },
});

export default Preview;
