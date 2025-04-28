import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '@/constants/colors';
import { WorkoutLog } from '@/types/workout';
import { formatDateShort, getDayOfWeekJP, getMonthRange } from '@/utils/date-utils';
import { getMuscleGroupColor } from '@/utils/workout-utils';

interface CalendarViewProps {
  workouts: WorkoutLog[];
  onSelectDate?: (date: Date) => void;
  style?: any;
}

export default function CalendarView({ 
  workouts, 
  onSelectDate,
  style 
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get first day of month and number of days in month
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Get day of week of first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDay.getDay();
  
  // Create array of days
  const days = [];
  
  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }
  
  // Group workouts by date
  const workoutsByDate = {};
  workouts.forEach(workout => {
    const date = new Date(workout.date);
    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    
    if (!workoutsByDate[dateString]) {
      workoutsByDate[dateString] = [];
    }
    
    workoutsByDate[dateString].push(workout);
  });
  
  // Get workout muscle groups for a specific date
  const getWorkoutMuscleGroups = (date: Date) => {
    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const dateWorkouts = workoutsByDate[dateString] || [];
    
    const muscleGroups = new Set();
    dateWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        // In a real app, you'd look up the exercise details to get the muscle group
        // For now, we'll extract it from the exercise ID
        const muscleGroup = exercise.exerciseId.split('-')[0];
        muscleGroups.add(muscleGroup);
      });
    });
    
    return Array.from(muscleGroups);
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format month and year
  const formattedMonthYear = `${currentMonth.getFullYear()}年${currentMonth.getMonth() + 1}月`;
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Text style={styles.navigationButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>{formattedMonthYear}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Text style={styles.navigationButton}>→</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekdaysContainer}>
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <Text 
            key={index} 
            style={[
              styles.weekday,
              index === 0 && styles.sunday,
              index === 6 && styles.saturday
            ]}
          >
            {day}
          </Text>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {days.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.emptyDay} />;
          }
          
          const isToday = new Date().toDateString() === day.toDateString();
          const muscleGroups = getWorkoutMuscleGroups(day);
          const hasWorkout = muscleGroups.length > 0;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.day,
                isToday && styles.today
              ]}
              onPress={() => onSelectDate && onSelectDate(day)}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.dayNumber,
                  isToday && styles.todayText,
                  day.getDay() === 0 && styles.sunday,
                  day.getDay() === 6 && styles.saturday
                ]}
              >
                {day.getDate()}
              </Text>
              
              {hasWorkout && (
                <View style={styles.workoutIndicators}>
                  {muscleGroups.slice(0, 3).map((group, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.workoutIndicator,
                        { backgroundColor: getMuscleGroupColor(group) }
                      ]} 
                    />
                  ))}
                  {muscleGroups.length > 3 && (
                    <View style={styles.moreIndicator}>
                      <Text style={styles.moreIndicatorText}>+</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navigationButton: {
    fontSize: 20,
    color: colors.primary,
    padding: 8,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  sunday: {
    color: colors.error,
  },
  saturday: {
    color: colors.primary,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  today: {
    backgroundColor: colors.progressBackground,
    borderRadius: 8,
  },
  dayNumber: {
    fontSize: 14,
    color: colors.text,
  },
  todayText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  workoutIndicators: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  workoutIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIndicatorText: {
    fontSize: 6,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 6,
  }
});