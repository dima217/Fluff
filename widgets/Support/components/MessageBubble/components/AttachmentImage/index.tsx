import { useMediaUrl } from "@/api";
import { SupportMessageAttachment } from "@/api/types";
import { isMediaServerUrl } from "@/api/utils/mediaUrl";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/ui/ThemedText";
import ImageFullscreenViewer from "@/widgets/Support/components/ImageFullscreenViewer";
import { createAttachmentStyles } from "@/widgets/Support/components/MessageBubble/components/attachmentStyles";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Pressable,
  StyleProp,
  View,
  ViewStyle
} from "react-native";

interface AttachmentImageProps {
  attachment: SupportMessageAttachment;
  style?: StyleProp<ViewStyle>;
  overflowLabel?: string;
}

const AttachmentImage = ({
  attachment,
  style,
  overflowLabel,
}: AttachmentImageProps) => {
  const styles = useThemedStyles(createAttachmentStyles);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { url: mediaUrl, headers } = useMediaUrl(attachment.url, {
    skip: !attachment.url,
  });

  const needsAuth = Boolean(mediaUrl && isMediaServerUrl(mediaUrl));

  if (!mediaUrl || (needsAuth && !headers)) {
    return (
      <View style={[styles.gridCellWrapper, styles.gridCellPlaceholder, style]} />
    );
  }

  const imageSource = headers
    ? { uri: mediaUrl, headers }
    : { uri: mediaUrl };

  return (
    <View style={[styles.gridCellWrapper, style]} collapsable={false}>
      <Pressable
        onPress={() => setIsFullscreen(true)}
        style={styles.gridCellPressable}
      >
        <Image
          source={imageSource}
          style={styles.gridImage}
          contentFit="cover"
          transition={200}
          recyclingKey={mediaUrl}
        />
        {overflowLabel ? (
          <View style={styles.overflowOverlay}>
            <ThemedText style={styles.overflowText}>{overflowLabel}</ThemedText>
          </View>
        ) : null}
      </Pressable>

      <ImageFullscreenViewer
        visible={isFullscreen}
        uri={mediaUrl}
        headers={headers}
        onClose={() => setIsFullscreen(false)}
      />
    </View>
  );
};

export default AttachmentImage;
