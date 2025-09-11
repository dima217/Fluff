import { Avatar } from 'react-native-elements';
import { styles } from './avatar.styles';

interface CustomAvatarProps {
    size?: 'small' | 'medium' | 'large' | number;
    uri?: string;
    title?: string;
}

const CustomAvatar = ({
    size, uri, title
}: CustomAvatarProps) => {
    if (uri) {
        return (
            <Avatar
                rounded
                source={{uri: uri}}
                size={size}
            />
        );
    }
    if (title) {
        return (
            <Avatar
                rounded
                title={title}
                size={size}
                overlayContainerStyle={styles.avatarBackground}
                titleStyle={styles.avatarText}
            />
        );
    }
}

export default CustomAvatar;