import Edit from "@/assets/images/Edit_fill.svg";
import { useGetProfileQuery, useMediaUrl } from "@/api";
import { useAppSelector } from "@/api/hooks";
import { CircleSizes } from "@/constants/components/CIrcle";
import { useColors } from "@/contexts/ThemeContext";
import { useAvatarPicker } from "@/hooks/useAvatarPicker";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Avatar from "@/shared/ui/Avatar";
import Circle from "@/shared/ui/Circle";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const CIRCLE_SIZE = 124;

interface AvatarUploaderProps {
  value?: string | null;
  onChange?: (uri: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ value, onChange }) => {
  const colors = useColors();
  const styles = useThemedStyles((c) => ({
    container: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    editButton: {
      position: "absolute" as const,
      bottom: 2,
      right: 2,
    },
  }));

  const { data: profile } = useGetProfileQuery();
  const user = useAppSelector((state) => state.user.profile);
  const displayProfile = profile || user;

  const { url: savedPhotoUrl, headers: savedPhotoHeaders } = useMediaUrl(
    displayProfile?.photo ?? undefined,
    { skip: !displayProfile?.photo }
  );

  const getInitials = () => {
    if (!displayProfile?.user) return "?";
    const firstName = displayProfile.user.firstName || "";
    const lastName = displayProfile.user.lastName || "";
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    if (displayProfile.user.email) return displayProfile.user.email[0].toUpperCase();
    return "?";
  };

  const { pickMedia } = useAvatarPicker();

  const handlePick = async () => {
    const picked = await pickMedia("image");
    if (picked && onChange) {
      onChange(picked.uri);
    }
  };

  const avatarSource = value
    ? { uri: value }
    : savedPhotoUrl
      ? { uri: savedPhotoUrl, ...(savedPhotoHeaders && { headers: savedPhotoHeaders }) }
      : null;

  return (
    <View style={styles.container}>
      {avatarSource ? (
        <Avatar size={CIRCLE_SIZE} source={avatarSource} />
      ) : (
        <Avatar size={CIRCLE_SIZE} title={getInitials()} />
      )}
      <TouchableOpacity style={styles.editButton} onPress={handlePick}>
        <Circle
          size={CircleSizes.MINI}
          svg={<Edit fill={colors.onPrimary} />}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AvatarUploader;
