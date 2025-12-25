import { ImageSourcePropType } from "react-native";
import { Avatar as RNAvatar } from "react-native-elements";
import { styles } from "./styles";

interface AvatarProps {
  size?: "small" | "medium" | "large" | number;
  uri?: string;
  source?: ImageSourcePropType;
  title?: string;
}

const Avatar = ({ size, uri, source, title }: AvatarProps) => {
  if (source) {
    return <RNAvatar rounded source={source} size={size} />;
  }
  if (uri) {
    return <RNAvatar rounded source={{ uri: uri }} size={size} />;
  }
  if (title) {
    return (
      <RNAvatar
        rounded
        title={title}
        size={size}
        overlayContainerStyle={styles.avatarBackground}
        titleStyle={styles.avatarText}
      />
    );
  }
};

export default Avatar;
