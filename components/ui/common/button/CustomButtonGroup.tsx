import { Colors } from '@/constants/Colors';
import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

type Props = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
};

const ToggleButtons = ({ options, selected, onSelect, style }: Props) => {

  return (
    <View style={[styles.container]}>
      {options.map((option, index) => {
        const isActive = selected === option;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? Colors.primary : Colors.inactive,
                borderTopLeftRadius: isFirst ? 25 : 0,
                borderBottomLeftRadius: isFirst ? 25 : 0,
                borderTopRightRadius: isLast ? 25 : 0,
                borderBottomRightRadius: isLast ? 25 : 0,
              },
              
              style,
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.text,
                { color: '#fff'},
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default memo(ToggleButtons);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 25,
    overflow: 'hidden',
    height: 50,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});
