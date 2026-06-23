import { RootState, useMediaUrl } from "@/api";
import ArrowLeft from "@/assets/images/ArrowLeft.svg";
import type { CustomProduct, SelectedProduct } from "@/constants/types";
import { useColors } from "@/contexts/ThemeContext";
import { useTranslation } from "@/hooks/useTranslation";
import { appSettingsStorage } from "@/storage/appSettings/appSettingsStorage";
import CheckBox from "@/shared/CheckBox";
import { ThemedText } from "@/shared/ui/ThemedText";
import { formatCookTime } from "@/widgets/Recipe/RecipeInfo/utils/formatCookTime";
import { cookAtFromForm } from "@/widgets/Recipe/RecipeNew/utils/cookAtForm";
import { Controller, useFormContext } from "react-hook-form";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const selectedProducts: SelectedProduct[] = allValues.selectedProducts || [];
  const customProducts: CustomProduct[] = allValues.customProducts || [];
  const cookAtSeconds = cookAtFromForm(allValues.cookHours, allValues.cookMinutes);
  const publishRecipesEnabled = appSettingsStorage.isPublishRecipesEnabled();

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

        {cookAtSeconds > 0 && (
          <View style={styles.metaBlock}>
            <ThemedText type="xs">
              {t("recipe.cookTime")}: {formatCookTime(cookAtSeconds)}
            </ThemedText>
          </View>
        )}

        {(selectedProducts.length > 0 || customProducts.length > 0) && (
          <View style={styles.ingredientsBlock}>
            <ThemedText type="s" style={styles.ingredientsTitle}>
              {t("recipe.ingredients")}
            </ThemedText>
            <View style={styles.tagsList}>
              {selectedProducts.map((p) => (
                <View key={p.id} style={styles.tag}>
                  <Text style={styles.tagText}>
                    {p.name}
                    {p.grams ? ` · ${p.grams} ${p.unit ?? "г"}` : ""}
                  </Text>
                </View>
              ))}
              {customProducts.map((cp, i) => (
                <View key={`c-${i}`} style={[styles.tag, styles.tagCustom]}>
                  <Text style={styles.tagText}>
                    {cp.name}
                    {cp.grams ? ` · ${cp.grams} ${cp.unit ?? "г"}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {publishRecipesEnabled ? (
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
        ) : null}
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
  metaBlock: {
    marginTop: 8,
    gap: 4,
  },
  ingredientsBlock: {
    marginTop: 12,
    gap: 8,
  },
  ingredientsTitle: {
    marginBottom: 2,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagCustom: {
    borderWidth: 1,
    borderColor: "#5B5B5B",
  },
  tagText: {
    color: "#E4E4E4",
    fontSize: 13,
  },
  checkboxes: {
    marginTop: 20,
    gap: 16,
  },
});

export default Preview;
