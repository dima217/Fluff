import { AppColors } from "@/constants/design-tokens";
import {
  ALBUM_HEIGHT,
  GRID_GAP,
  IMAGE_MAX_WIDTH,
  IMAGE_MIN_WIDTH,
  SINGLE_IMAGE_HEIGHT,
} from "@/widgets/Support/components/MessageBubble/lib/constants";
import { StyleSheet } from "react-native";

export const createAttachmentStyles = (colors: AppColors) =>
  StyleSheet.create({
    imageContainer: {
      alignSelf: "center",
      width: IMAGE_MAX_WIDTH,
      minWidth: IMAGE_MIN_WIDTH,
      maxWidth: IMAGE_MAX_WIDTH,
      marginTop: 10,
      marginHorizontal: 4,
    },
    singleImageCell: {
      width: "100%",
      height: SINGLE_IMAGE_HEIGHT,
      borderRadius: 12,
    },
    albumContainer: {
      alignSelf: "center",
      width: IMAGE_MAX_WIDTH,
      minWidth: IMAGE_MIN_WIDTH,
      maxWidth: IMAGE_MAX_WIDTH,
      marginTop: 10,
      marginHorizontal: 4,
      height: ALBUM_HEIGHT,
    },
    albumRow: {
      flexDirection: "row",
    },
    albumRowFill: {
      flex: 1,
    },
    albumColumn: {
      flex: 1,
      alignSelf: "stretch",
    },
    albumCellFlex: {
      flex: 1,
      alignSelf: "stretch",
      minWidth: 0,
      minHeight: 0,
      borderRadius: 6,
    },
    albumGapHorizontal: {
      width: GRID_GAP,
    },
    albumGapVertical: {
      height: GRID_GAP,
    },
    gridCellWrapper: {
      overflow: "hidden",
      backgroundColor: colors.overlaySubtle,
    },
    gridCellPressable: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    gridCellPlaceholder: {
      backgroundColor: colors.overlaySubtle,
    },
    gridImage: {
      ...StyleSheet.absoluteFillObject,
    },
    overflowOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      alignItems: "center",
      justifyContent: "center",
    },
    overflowText: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "700",
    },
  });
