import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkoutSet } from '@/types/workout';
import Card from './Card';
import colors from '@/constants/colors';
import { formatDateJP } from '@/utils/date-utils';
import { formatWeight, getRankColor } from '@/utils/workout-utils';
import { Award, TrendingUp } from 'lucide-react-native';

interface PersonalBestCardProps {
  exerciseId: string;
  personalBest: WorkoutSet;
  rank: string;
  onPress?: () => void;
  style?: any;
}

export default function PersonalBestCard({ 
  exerciseId, 
  personalBest,
  rank,
  onPress,
  style 
}: PersonalBestCardProps) {
  const date = new Date(personalBest.date);
  const formattedDate = formatDateJP(date);
  
  return (
    <Card 
      onPress={onPress}
      style={[styles.card, style]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.exerciseName}>{exerciseId}</Text>
          <View 
            style={[
              styles.rankBadge,
              { backgroundColor: getRankColor(rank) }
            ]}
          >
            <Text style={styles.rankText}>{rank}</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <TrendingUp size={16} color={colors.secondary} />
            <Text style={styles.statLabel}>1RM</Text>
            <Text style={styles.statValue}>
              {formatWeight(personalBest.oneRepMax)}
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Award size={16} color={colors.accent} />
            <Text style={styles.statLabel}>記録</Text>
            <Text style={styles.statValue}>
              {formatWeight(personalBest.weight)} × {personalBest.reps}
            </Text>
          </View>
        </View>
        
        <Text style={styles.date}>{formattedDate}に達成</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  rankBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
  }
});