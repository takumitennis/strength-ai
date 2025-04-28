import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  height?: number;
  color?: string;
  showPercentage?: boolean;
  style?: any;
}

export default function ProgressBar({
  progress,
  label,
  height = 8,
  color = colors.secondary,
  showPercentage = false,
  style
}: ProgressBarProps) {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.progressContainer, { height }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height
            }
          ]} 
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: colors.text,
  },
  progressContainer: {
    backgroundColor: colors.progressBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
    textAlign: 'right',
  }
});