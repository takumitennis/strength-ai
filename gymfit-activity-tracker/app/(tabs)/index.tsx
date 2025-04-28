import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/user-store';
import { useWorkoutStore } from '@/store/workout-store';
import colors from '@/constants/colors';
import AvatarDisplay from '@/components/AvatarDisplay';
import MuscleGroupBars from '@/components/MuscleGroupBars';
import Card from '@/components/Card';
import WorkoutCard from '@/components/WorkoutCard';
import PersonalBestCard from '@/components/PersonalBestCard';
import Button from '@/components/Button';
import { mockUser, mockUserProgress } from '@/mocks/user';
import { mockWorkoutLogs } from '@/mocks/workouts';
import { mockExercises } from '@/mocks/exercises';
import { formatDateJP } from '@/utils/date-utils';
import { useRouter } from 'expo-router';
import { Dumbbell, Calendar, TrendingUp } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, progress, setUser, updateProgress } = useUserStore();
  const { logs, exercises, addWorkoutLog } = useWorkoutStore();
  
  // Initialize with mock data if empty
  useEffect(() => {
    if (!user) {
      setUser(mockUser);
      updateProgress(mockUserProgress);
    }
    
    if (logs.length === 0) {
      mockWorkoutLogs.forEach(log => {
        addWorkoutLog(log);
      });
    }
    
    if (exercises.length === 0) {
      mockExercises.forEach(exercise => {
        useWorkoutStore.getState().addExercise(exercise);
      });
    }
  }, []);
  
  // Get today's date
  const today = new Date();
  const formattedToday = formatDateJP(today);
  
  // Get recent workouts
  const recentWorkouts = logs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);
  
  // Get personal bests
  const personalBests = Object.entries(progress.personalBests).slice(0, 2);
  
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>こんにちは、{user.displayName}さん</Text>
          <Text style={styles.date}>{formattedToday}</Text>
        </View>
        
        <View style={styles.avatarSection}>
          <AvatarDisplay 
            user={user}
            progress={progress}
            size="large"
          />
          
          <View style={styles.progressBars}>
            <MuscleGroupBars progress={progress.muscleGroups} />
          </View>
        </View>
        
        <Card title="今日の予定">
          <View style={styles.scheduleContent}>
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleIcon}>
                <Dumbbell size={20} color={colors.primary} />
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTitle}>胸トレの日</Text>
                <Text style={styles.scheduleDescription}>
                  ベンチプレス、インクラインベンチ、ダンベルフライ
                </Text>
              </View>
            </View>
            
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleIcon}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTitle}>30日スクワットチャレンジ</Text>
                <Text style={styles.scheduleDescription}>
                  今日のノルマ: 50回 (残り10日)
                </Text>
              </View>
            </View>
          </View>
          
          <Button 
            title="トレーニングを記録する"
            onPress={() => router.push('/log')}
            variant="primary"
            fullWidth
            style={styles.scheduleButton}
          />
        </Card>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近のトレーニング</Text>
          <Button 
            title="すべて見る"
            onPress={() => router.push('/calendar')}
            variant="ghost"
            size="small"
          />
        </View>
        
        {recentWorkouts.map((workout) => (
          <WorkoutCard 
            key={workout.id}
            workout={workout}
            onPress={() => {}}
          />
        ))}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>自己ベスト</Text>
          <Button 
            title="すべて見る"
            onPress={() => {}}
            variant="ghost"
            size="small"
          />
        </View>
        
        {personalBests.map(([exerciseId, pb]) => (
          <PersonalBestCard 
            key={exerciseId}
            exerciseId={exerciseId}
            personalBest={pb}
            rank={progress.strengthRanks[exerciseId] || 'E'}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  progressBars: {
    flex: 1,
  },
  scheduleContent: {
    gap: 16,
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.progressBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  scheduleButton: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
});