import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProgress } from '@/types/workout';
import colors from '@/constants/colors';
import { User } from '@/types/user';
import Avatar from './Avatar';

interface AvatarDisplayProps {
  user: User;
  progress: UserProgress;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function AvatarDisplay({ 
  user, 
  progress,
  size = 'medium',
  style 
}: AvatarDisplayProps) {
  // Calculate overall progress
  const overallProgress = Object.values(progress.muscleGroups).reduce(
    (sum, value) => sum + value, 
    0
  ) / Object.values(progress.muscleGroups).length;
  
  // Determine avatar size based on prop
  const avatarSize = size === 'small' ? 80 : size === 'large' ? 160 : 120;
  const ringSize = avatarSize + 16;
  
  // Determine level based on overall progress
  const level = Math.floor(overallProgress / 10) + 1;
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={[colors.secondary, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.progressRing,
            { 
              width: ringSize, 
              height: ringSize, 
              borderRadius: ringSize / 2 
            }
          ]}
        >
          <View 
            style={[
              styles.avatarBackground,
              { 
                width: avatarSize + 8, 
                height: avatarSize + 8, 
                borderRadius: (avatarSize + 8) / 2 
              }
            ]}
          >
            <Avatar
              uri={user.avatarUrl}
              size={avatarSize}
            />
          </View>
        </LinearGradient>
        
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
      </View>
      
      {size !== 'small' && (
        <Text style={styles.username}>{user.displayName}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBackground: {
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cardBackground,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  }
});