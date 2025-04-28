import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Challenge } from '@/types/challenge';
import Card from './Card';
import ProgressBar from './ProgressBar';
import Avatar from './Avatar';
import colors from '@/constants/colors';
import { formatDateShort } from '@/utils/date-utils';
import { Trophy, Users } from 'lucide-react-native';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress?: () => void;
  style?: any;
}

export default function ChallengeCard({ 
  challenge, 
  onPress,
  style 
}: ChallengeCardProps) {
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  
  const formattedDateRange = `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
  
  // Sort participants by progress (descending)
  const sortedParticipants = [...challenge.participants]
    .sort((a, b) => b.progress - a.progress);
  
  return (
    <Card 
      title={challenge.title}
      onPress={onPress}
      style={style}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateRange}>{formattedDateRange}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Trophy size={16} color={colors.accent} />
              <Text style={styles.statText}>{challenge.goal}{challenge.unit}</Text>
            </View>
            <View style={styles.stat}>
              <Users size={16} color={colors.primary} />
              <Text style={styles.statText}>{challenge.participants.length}人</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.description}>{challenge.description}</Text>
        
        <View style={styles.tagsContainer}>
          {challenge.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.participantsContainer}>
          <Text style={styles.participantsTitle}>参加者ランキング</Text>
          {sortedParticipants.map((participant, index) => (
            <View key={index} style={styles.participant}>
              <View style={styles.participantInfo}>
                <Text style={styles.rank}>{index + 1}</Text>
                <Avatar 
                  uri={participant.avatarUrl} 
                  size={24} 
                />
                <Text style={styles.username}>{participant.username}</Text>
              </View>
              <View style={styles.progressContainer}>
                <ProgressBar 
                  progress={participant.progress} 
                  height={6}
                  color={index === 0 ? colors.accent : colors.secondary}
                />
                <Text style={styles.progressText}>{Math.round(participant.progress)}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    
  },
  dateRange: {
    fontSize: 14,
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
  statText: {
    fontSize: 12,
    color: colors.textLight,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.progressBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.textLight,
  },
  participantsContainer: {
    gap: 12,
  },
  participantsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  participant: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 2,
  },
  rank: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    width: 20,
    textAlign: 'center',
  },
  username: {
    fontSize: 14,
    color: colors.text,
  },
  progressContainer: {
    flex: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: 2,
  }
});