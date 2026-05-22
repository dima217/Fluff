import { SupportMessageAttachment } from "@/api/types";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import AttachmentImage from "@/widgets/Support/components/MessageBubble/components/AttachmentImage";
import { createAttachmentStyles } from "@/widgets/Support/components/MessageBubble/components/attachmentStyles";
import { getAlbumLayout } from "@/widgets/Support/components/MessageBubble/lib/albumLayout";
import {
  ALBUM_HEIGHT,
  GRID_GAP,
  MAX_ALBUM_ITEMS,
} from "@/widgets/Support/components/MessageBubble/lib/constants";
import React from "react";
import { View } from "react-native";

interface MessageAttachmentsAlbumProps {
  attachments: SupportMessageAttachment[];
}

const MessageAttachmentsAlbum = ({
  attachments,
}: MessageAttachmentsAlbumProps) => {
  const styles = useThemedStyles(createAttachmentStyles);
  const visibleCount = Math.min(attachments.length, MAX_ALBUM_ITEMS);
  const overflowCount =
    attachments.length > MAX_ALBUM_ITEMS
      ? attachments.length - MAX_ALBUM_ITEMS
      : 0;
  const visibleAttachments = attachments.slice(0, visibleCount);

  if (visibleCount === 3) {
    return (
      <View style={styles.albumContainer}>
        <View style={[styles.albumRow, styles.albumRowFill]}>
          <AttachmentImage
            attachment={visibleAttachments[0]}
            style={styles.albumCellFlex}
          />
          <View style={styles.albumGapHorizontal} />
          <View style={styles.albumColumn}>
            <AttachmentImage
              attachment={visibleAttachments[1]}
              style={styles.albumCellFlex}
            />
            <View style={styles.albumGapVertical} />
            <AttachmentImage
              attachment={visibleAttachments[2]}
              style={styles.albumCellFlex}
            />
          </View>
        </View>
      </View>
    );
  }

  const layout = getAlbumLayout(visibleCount);
  const rowHeight =
    (ALBUM_HEIGHT - (layout.length - 1) * GRID_GAP) / layout.length;

  return (
    <View style={styles.albumContainer}>
      {layout.map((row, rowIndex) => (
        <React.Fragment key={row.join("-")}>
          {rowIndex > 0 ? <View style={styles.albumGapVertical} /> : null}
          <View style={[styles.albumRow, { height: rowHeight }]}>
            {row.map((attachmentIndex, colIndex) => (
              <React.Fragment key={attachmentIndex}>
                {colIndex > 0 ? <View style={styles.albumGapHorizontal} /> : null}
                <AttachmentImage
                  attachment={visibleAttachments[attachmentIndex]}
                  style={styles.albumCellFlex}
                  overflowLabel={
                    overflowCount > 0 && attachmentIndex === MAX_ALBUM_ITEMS - 1
                      ? `+${overflowCount}`
                      : undefined
                  }
                />
              </React.Fragment>
            ))}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

export default MessageAttachmentsAlbum;
