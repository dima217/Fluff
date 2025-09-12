import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.progressBarWrapper}>
      <View style={[styles.progressBar, { width: `${clampedProgress}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarWrapper: {
    height: 10,
    backgroundColor: '#333333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default ProgressBar;