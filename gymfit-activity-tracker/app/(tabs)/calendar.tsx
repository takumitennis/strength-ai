import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@/store/workout-store';
import colors from '@/constants/colors';
import CalendarView from '@/components/CalendarView';
import WorkoutCard from '@/components/WorkoutCard';
import { formatDateJP } from '@/utils/date-utils';

export default function CalendarScreen() {
  const { logs } = useWorkoutStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Get workouts for selected date
  const getWorkoutsForDate = (date: Date) => {
    if (!date) return [];
    
    return logs.filter(log => {
      const logDate = new Date(log.date);
      return (
        logDate.getFullYear() === date.getFullYear() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getDate() === date.getDate()
      );
    });
  };
  
  const selectedWorkouts = selectedDate ? getWorkoutsForDate(selectedDate) : [];
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>トレーニングカレンダー</Text>
        
        <CalendarView 
          workouts={logs}
          onSelectDate={setSelectedDate}
          style={styles.calendar}
        />
        
        {selectedDate && (
          <View style={styles.selectedDateSection}>
            <Text style={styles.selectedDateTitle}>
              {formatDateJP(selectedDate)}のトレーニング
            </Text>
            
            {selectedWorkouts.length > 0 ? (
              selectedWorkouts.map(workout => (
                <WorkoutCard 
                  key={workout.id}
                  workout={workout}
                  onPress={() => {}}
                />
              ))
            ) : (
              <View style={styles.noWorkoutsContainer}>
                <Text style={styles.noWorkoutsText}>
                  この日のトレーニング記録はありません
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  calendar: {
    marginBottom: 24,
  },
  selectedDateSection: {
    
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  noWorkoutsContainer: {
    padding: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noWorkoutsText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  }
});