import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDateJP, getDayOfWeekJP } from '@/utils/date-utils';
import { WorkoutLog } from '@/types/workout';
import Card from './Card';
import colors from '@/constants/colors';
import { Dumbbell } from 'lucide-react-native';

interface WorkoutCardProps {
  workout: WorkoutLog;
  onPress?: () => void;
  compact?: boolean;
  style?: any;
}

export default function WorkoutCard({ 
  workout, 
  onPress,
  compact = false,
  style 
}: WorkoutCardProps) {
  const date = new Date(workout.date);
  const formattedDate = formatDateJP(date);
  const dayOfWeek = getDayOfWeekJP(date);
  
  // Count total sets and exercises
  const totalExercises = workout.exercises.length;
  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length, 
    0
  );
  
  return (
    <Card 
      onPress={onPress}
      style={[styles.card, compact && styles.compactCard, style]}
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.day}>({dayOfWeek})</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Dumbbell size={16} color={colors.primary} />
            <Text style={styles.statText}>{totalExercises}種目</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{totalSets}</Text>
            <Text style={styles.statText}>セット</Text>
          </View>
        </View>
      </View>
      
      {!compact && workout.notes && (
        <Text style={styles.notes}>{workout.notes}</Text>
      )}
      
      {!compact && (
        <View style={styles.exerciseList}>
          {workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>
                {exercise.exerciseId}
              </Text>
              <Text style={styles.exerciseSets}>
                {exercise.sets.length}セット
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  compactCard: {
    padding: 12,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  day: {
    fontSize: 12,
    color: colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  statText: {
    fontSize: 12,
    color: colors.textLight,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  exerciseList: {
    gap: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: colors.progressBackground,
    borderRadius: 6,
  },
  exerciseName: {
    fontSize: 14,
    color: colors.text,
  },
  exerciseSets: {
    fontSize: 12,
    color: colors.textLight,
  }
});