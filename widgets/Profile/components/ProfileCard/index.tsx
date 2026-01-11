import { useGetProfileQuery } from "@/api";
import { useAppSelector } from "@/api/hooks";
import { CircleSizes } from "@/constants/components/CIrcle";
import { useTranslation } from "@/hooks/useTranslation";
import Button from "@/shared/Buttons/Button";
import Avatar from "@/shared/ui/Avatar";
import GradientView from "@/shared/ui/GradientView";
import PatternBackground from "@/shared/ui/PatternBackground";
import RadialGradientBackground from "@/shared/ui/RadialGradientBackground";
import { ThemedText } from "@/shared/ui/ThemedText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import TimeLabel from "./ui/TimeLabel";

const ProfileCard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: profile, isLoading } = useGetProfileQuery();
  const user = useAppSelector((state) => state.user.profile);

  const displayProfile = profile || user;

  const getInitials = () => {
    if (!displayProfile?.user) return "?";
    const firstName = displayProfile.user.firstName || "";
    const lastName = displayProfile.user.lastName || "";
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    if (displayProfile.user.email)
      return displayProfile.user.email[0].toUpperCase();
    return "?";
  };

  const getFullName = () => {
    if (!displayProfile?.user) return "";
    const firstName = displayProfile.user.firstName || "";
    const lastName = displayProfile.user.lastName || "";
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) return firstName;
    if (lastName) return lastName;
    return displayProfile.user.email || "";
  };

  if (isLoading && !displayProfile) {
    return (
      <GradientView style={styles.container}>
        <ThemedText>{t("common.loading") || "Загрузка..."}</ThemedText>
      </GradientView>
    );
  }

  return (
    <GradientView style={styles.container}>
      <PatternBackground style={styles.patternContainer} />
      <RadialGradientBackground style={styles.radialContainer} />
      <View style={styles.profileRow}>
        <Avatar size={CircleSizes.MEDIUM} title={getInitials()} />
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          title={t("common.edit")}
          onPress={() => router.push("/(app)/profile/settings")}
        />
      </View>
      <View style={styles.profileInfoColumn}>
        <TimeLabel />
        <ThemedText type="subtitle">{getFullName()}</ThemedText>
        <ThemedText type="notion">
          {displayProfile?.user?.email || ""}
        </ThemedText>
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
    borderRadius: 20,
  },
  radialContainer: {
    borderRadius: 20,
    ...StyleSheet.absoluteFillObject,
  },
  patternContainer: {
    borderRadius: 20,
    height: 100,
    ...StyleSheet.absoluteFillObject,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileInfoColumn: {
    marginTop: 35,
    gap: 6,
  },
  button: {
    width: 64,
    height: 30,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  buttonText: {
    fontSize: 12,
  },
});

export default ProfileCard;
