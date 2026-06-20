import { AppColors } from "@/constants/design-tokens";
import { useColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ReactNode, RefObject, useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { ThemedText } from "../ThemedText";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  visible: boolean;
  onClose: () => void;
  anchorRef: RefObject<View | null>;
  items: ContextMenuItem[];
}

interface AnchorLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ContextMenu = ({ visible, onClose, anchorRef, items }: ContextMenuProps) => {
  const colors = useColors();
  const styles = useThemedStyles(createStyles);
  const [layout, setLayout] = useState<AnchorLayout | null>(null);

  useEffect(() => {
    if (!visible) {
      setLayout(null);
      return;
    }

    requestAnimationFrame(() => {
      anchorRef.current?.measureInWindow((x, y, width, height) => {
        setLayout({ x, y, width, height });
      });
    });
  }, [visible, anchorRef]);

  if (!visible || items.length === 0) return null;

  const screenWidth = Dimensions.get("window").width;
  const menuTop = layout ? layout.y + layout.height + 8 : 80;
  const menuRight = layout
    ? Math.max(12, screenWidth - (layout.x + layout.width))
    : 12;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View
          style={[
            styles.menu,
            {
              top: menuTop,
              right: menuRight,
              backgroundColor: colors.tab,
              shadowColor: colors.text,
            },
          ]}
        >
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.row,
                index < items.length - 1 && styles.rowBorder,
                item.disabled && styles.rowDisabled,
              ]}
              onPress={() => {
                if (item.disabled) return;
                item.onPress();
                onClose();
              }}
              activeOpacity={0.65}
              disabled={item.disabled}
            >
              {item.icon ? <View style={styles.iconWrap}>{item.icon}</View> : null}
              <ThemedText
                type="mini"
                style={[{ color: item.destructive ? colors.reject : colors.text }]}
                numberOfLines={1}
              >
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
    },
    menu: {
      position: "absolute",
      minWidth: 220,
      maxWidth: 280,
      borderRadius: 12,
      overflow: "hidden",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 10,
    },
    rowBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowDisabled: {
      opacity: 0.45,
    },
    iconWrap: {
      width: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      flex: 1,
      fontSize: 16,
    },
  });

export default ContextMenu;
