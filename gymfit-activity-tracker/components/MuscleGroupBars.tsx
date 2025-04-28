import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';
import colors from '@/constants/colors';
import { MuscleGroup } from '@/types/workout';

interface MuscleGroupBarsProps {
  progress: Record<MuscleGroup, number>;
  compact?: boolean;
  style?: any;
}

export default function MuscleGroupBars({ 
  progress, 
  compact = false,
  style 
}: MuscleGroupBarsProps) {
  const muscleGroups = [
    { key: 'chest' as MuscleGroup, label: '胸', color: colors.chest },
    { key: 'back' as MuscleGroup, label: '背中', color: colors.back },
    { key: 'legs' as MuscleGroup, label: '脚', color: colors.legs },
    { key: 'arms' as MuscleGroup, label: '腕', color: colors.arms },
    { key: 'core' as MuscleGroup, label: '体幹', color: colors.core },
  ];
  
  return (
    <View style={[styles.container, style]}>
      {muscleGroups.map((group) => (
        <View key={group.key} style={compact ? styles.barCompact : styles.bar}>
          <ProgressBar
            progress={progress[group.key]}
            label={compact ? undefined : group.label}
            color={group.color}
            height={compact ? 6 : 8}
            showPercentage={!compact}
          />
          {compact && (
            <Text style={styles.compactLabel}>{group.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bar: {
    marginBottom: 12,
  },
  barCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  compactLabel: {
    fontSize: 12,
    color: colors.text,
    width: 30,
    textAlign: 'center',
  }
});