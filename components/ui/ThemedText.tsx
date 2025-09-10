import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  titleSize?: number;
  highlightLastWord?: boolean;
  type?: 'title' | 'subtitle' | 'default';
};

export function ThemedText({
  style,
  type = 'default',
  highlightLastWord = false,
  titleSize,
  children,
  ...rest
}: ThemedTextProps) {
    
  /* const [fontsLoaded] = useFonts({
    'SFProText-Medium': require('../../assets/fonts/SFProText-Medium.ttf'),
  }); 

  if (!fontsLoaded) {
    return null; 
  } */

  const color = Colors.text;

  if (type === 'title' && typeof children === 'string' && highlightLastWord) {
    const words = children.trim().split(' ');
    const lastWord = words.pop();
    const textWithoutLast = words.join(' ');

    return (
      <Text
        style={[
          { color },
          styles.title,
          titleSize ? { fontSize: titleSize, lineHeight: titleSize + 2 } : null,
          style,
        ]}
        {...rest}
      >
        {textWithoutLast}{' '}
        <Text style={{ color: Colors.primary }}>{lastWord}</Text>
      </Text>
    );
  }

  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'title' && [
          styles.title,
          titleSize ? {fontSize: titleSize} : null,
        ],
        type === 'subtitle' && styles.subtitle,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: '#8B868F',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
