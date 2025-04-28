import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@/store/workout-store';
import colors from '@/constants/colors';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Exercise, MuscleGroup, WorkoutSet } from '@/types/workout';
import { calculateOneRepMax, formatWeight, getMuscleGroupColor } from '@/utils/workout-utils';
import { useRouter } from 'expo-router';
import { ChevronDown, Plus, Trash2, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function LogScreen() {
  const router = useRouter();
  const { exercises, addWorkoutLog } = useWorkoutStore();
  
  const [selectedExercises, setSelectedExercises] = useState<{
    exerciseId: string;
    sets: {
      weight: string;
      reps: string;
    }[];
  }[]>([]);
  
  const [notes, setNotes] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
  
  // Group exercises by muscle group
  const exercisesByMuscleGroup: Record<MuscleGroup, Exercise[]> = {
    chest: [],
    back: [],
    legs: [],
    arms: [],
    core: []
  };
  
  exercises.forEach(exercise => {
    exercisesByMuscleGroup[exercise.muscleGroup].push(exercise);
  });
  
  // Add exercise to workout
  const addExercise = (exerciseId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId,
        sets: [{ weight: '', reps: '' }]
      }
    ]);
    
    setShowExerciseSelector(false);
  };
  
  // Remove exercise from workout
  const removeExercise = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const updatedExercises = [...selectedExercises];
    updatedExercises.splice(index, 1);
    setSelectedExercises(updatedExercises);
  };
  
  // Add set to exercise
  const addSet = (exerciseIndex: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets.push({ weight: '', reps: '' });
    setSelectedExercises(updatedExercises);
  };
  
  // Remove set from exercise
  const removeSet = (exerciseIndex: number, setIndex: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setSelectedExercises(updatedExercises);
  };
  
  // Update set weight
  const updateSetWeight = (exerciseIndex: number, setIndex: number, weight: string) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets[setIndex].weight = weight;
    setSelectedExercises(updatedExercises);
  };
  
  // Update set reps
  const updateSetReps = (exerciseIndex: number, setIndex: number, reps: string) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[exerciseIndex].sets[setIndex].reps = reps;
    setSelectedExercises(updatedExercises);
  };
  
  // Calculate 1RM for a set
  const calculate1RM = (weight: string, reps: string): string => {
    if (!weight || !reps) return '-';
    
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);
    
    if (isNaN(weightNum) || isNaN(repsNum) || repsNum <= 0) return '-';
    
    const oneRepMax = calculateOneRepMax(weightNum, repsNum);
    return formatWeight(oneRepMax);
  };
  
  // Save workout
  const saveWorkout = () => {
    // Validate workout
    if (selectedExercises.length === 0) {
      Alert.alert('エラー', 'トレーニングを追加してください。');
      return;
    }
    
    // Check if all sets have weight and reps
    let isValid = true;
    selectedExercises.forEach(exercise => {
      if (exercise.sets.length === 0) {
        isValid = false;
      }
      
      exercise.sets.forEach(set => {
        if (!set.weight || !set.reps) {
          isValid = false;
        }
      });
    });
    
    if (!isValid) {
      Alert.alert('エラー', 'すべてのセットに重量と回数を入力してください。');
      return;
    }
    
    // Create workout log
    const workoutLog = {
      date: new Date().toISOString(),
      exercises: selectedExercises.map(exercise => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets.map(set => ({
          exerciseId: exercise.exerciseId,
          weight: parseFloat(set.weight),
          reps: parseInt(set.reps),
          date: new Date().toISOString(),
        }))
      })),
      notes: notes.trim()
    };
    
    // Add workout log
    addWorkoutLog(workoutLog);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Show success message
    Alert.alert(
      '保存完了',
      'トレーニングを記録しました。',
      [
        { text: 'OK', onPress: () => router.push('/') }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>トレーニングを記録</Text>
        
        <Button
          title="種目を追加"
          onPress={() => setShowExerciseSelector(true)}
          icon={Plus}
          style={styles.addButton}
          fullWidth
        />
        
        {selectedExercises.map((exercise, exerciseIndex) => {
          const exerciseDetails = exercises.find(e => e.exerciseId === exercise.exerciseId);
          
          return (
            <Card key={exerciseIndex} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseInfo}>
                  <View 
                    style={[
                      styles.muscleGroupIndicator,
                      { backgroundColor: getMuscleGroupColor(exerciseDetails?.muscleGroup || 'chest') }
                    ]} 
                  />
                  <Text style={styles.exerciseName}>{exercise.exerciseId}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeExercise(exerciseIndex)}
                  style={styles.removeButton}
                >
                  <Trash2 size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.setsHeader}>
                <Text style={styles.setHeaderText}>セット</Text>
                <Text style={styles.weightHeaderText}>重量 (kg)</Text>
                <Text style={styles.repsHeaderText}>回数</Text>
                <Text style={styles.oneRmHeaderText}>1RM</Text>
                <View style={styles.removeSetHeader} />
              </View>
              
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  <TextInput
                    style={styles.weightInput}
                    value={set.weight}
                    onChangeText={(text) => updateSetWeight(exerciseIndex, setIndex, text)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <TextInput
                    style={styles.repsInput}
                    value={set.reps}
                    onChangeText={(text) => updateSetReps(exerciseIndex, setIndex, text)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  <Text style={styles.oneRmValue}>
                    {calculate1RM(set.weight, set.reps)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeSet(exerciseIndex, setIndex)}
                    style={styles.removeSetButton}
                    disabled={exercise.sets.length <= 1}
                  >
                    <X 
                      size={16} 
                      color={exercise.sets.length <= 1 ? colors.inactive : colors.error} 
                    />
                  </TouchableOpacity>
                </View>
              ))}
              
              <Button
                title="セットを追加"
                onPress={() => addSet(exerciseIndex)}
                variant="outline"
                size="small"
                icon={Plus}
                style={styles.addSetButton}
              />
            </Card>
          );
        })}
        
        <Card title="メモ" style={styles.notesCard}>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="トレーニングのメモを入力..."
            multiline
          />
        </Card>
        
        <Button
          title="保存"
          onPress={saveWorkout}
          style={styles.saveButton}
          fullWidth
          disabled={selectedExercises.length === 0}
        />
      </ScrollView>
      
      {showExerciseSelector && (
        <View style={styles.selectorOverlay}>
          <View style={styles.selectorContainer}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>種目を選択</Text>
              <TouchableOpacity
                onPress={() => setShowExerciseSelector(false)}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.muscleGroupTabs}>
              {Object.keys(exercisesByMuscleGroup).map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.muscleGroupTab,
                    selectedMuscleGroup === group && styles.selectedMuscleGroupTab,
                    { borderBottomColor: getMuscleGroupColor(group) }
                  ]}
                  onPress={() => setSelectedMuscleGroup(group as MuscleGroup)}
                >
                  <Text 
                    style={[
                      styles.muscleGroupTabText,
                      selectedMuscleGroup === group && styles.selectedMuscleGroupTabText
                    ]}
                  >
                    {group === 'chest' ? '胸' :
                     group === 'back' ? '背中' :
                     group === 'legs' ? '脚' :
                     group === 'arms' ? '腕' : '体幹'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <ScrollView style={styles.exerciseList}>
              {(selectedMuscleGroup ? 
                exercisesByMuscleGroup[selectedMuscleGroup] : 
                exercises
              ).map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseItem}
                  onPress={() => addExercise(exercise.id)}
                >
                  <View 
                    style={[
                      styles.exerciseItemIndicator,
                      { backgroundColor: getMuscleGroupColor(exercise.muscleGroup) }
                    ]} 
                  />
                  <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                  {exercise.isCompound && (
                    <View style={styles.compoundBadge}>
                      <Text style={styles.compoundBadgeText}>複合</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
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
  addButton: {
    marginBottom: 16,
  },
  exerciseCard: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  muscleGroupIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  removeButton: {
    padding: 4,
  },
  setsHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  setHeaderText: {
    width: 40,
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  weightHeaderText: {
    flex: 1,
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  repsHeaderText: {
    flex: 1,
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  oneRmHeaderText: {
    flex: 1,
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  removeSetHeader: {
    width: 30,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setNumber: {
    width: 40,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  weightInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.progressBackground,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    textAlign: 'center',
  },
  repsInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.progressBackground,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    textAlign: 'center',
  },
  oneRmValue: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  removeSetButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSetButton: {
    marginTop: 8,
  },
  notesCard: {
    marginBottom: 24,
  },
  notesInput: {
    height: 100,
    backgroundColor: colors.progressBackground,
    borderRadius: 4,
    padding: 8,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginBottom: 16,
  },
  selectorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  selectorContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  muscleGroupTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  muscleGroupTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.inactive,
  },
  selectedMuscleGroupTab: {
    borderBottomWidth: 2,
  },
  muscleGroupTabText: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedMuscleGroupTabText: {
    fontWeight: 'bold',
    color: colors.text,
  },
  exerciseList: {
    maxHeight: 400,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseItemIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  exerciseItemName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  compoundBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  compoundBadgeText: {
    fontSize: 10,
    color: '#fff',
  }
});