import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise, WorkoutLog, WorkoutSet } from '@/types/workout';
import { calculateOneRepMax, calculateStrengthRank } from '@/utils/workout-utils';
import { useUserStore } from './user-store';

interface WorkoutState {
  logs: WorkoutLog[];
  exercises: Exercise[];
  isLoading: boolean;
  error: string | null;
  addExercise: (exercise: Omit<Exercise, 'id'>) => Exercise;
  addWorkoutLog: (log: Omit<WorkoutLog, 'id'>) => void;
  addWorkoutSet: (workoutId: string, exerciseId: string, set: Omit<WorkoutSet, 'id' | 'oneRepMax'>) => void;
  updateWorkoutLog: (logId: string, updates: Partial<Omit<WorkoutLog, 'id'>>) => void;
  deleteWorkoutLog: (logId: string) => void;
  getExercisesByMuscleGroup: (muscleGroup: string) => Exercise[];
  getRecentWorkouts: (limit?: number) => WorkoutLog[];
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      logs: [],
      exercises: [],
      isLoading: false,
      error: null,
      
      addExercise: (exerciseData) => {
        const newExercise: Exercise = {
          id: Date.now().toString(),
          ...exerciseData
        };
        
        set((state) => ({
          exercises: [...state.exercises, newExercise]
        }));
        
        return newExercise;
      },
      
      addWorkoutLog: (logData) => {
        const newLog: WorkoutLog = {
          id: Date.now().toString(),
          ...logData
        };
        
        set((state) => ({
          logs: [...state.logs, newLog]
        }));
        
        // Update user progress after adding workout
        updateUserProgress(newLog);
      },
      
      addWorkoutSet: (workoutId, exerciseId, setData) => {
        const newSet: WorkoutSet = {
          id: Date.now().toString(),
          exerciseId,
          oneRepMax: calculateOneRepMax(setData.weight, setData.reps),
          ...setData
        };
        
        set((state) => ({
          logs: state.logs.map(log => 
            log.id === workoutId
              ? {
                  ...log,
                  exercises: log.exercises.map(ex => 
                    ex.exerciseId === exerciseId
                      ? { ...ex, sets: [...ex.sets, newSet] }
                      : ex
                  )
                }
              : log
          )
        }));
        
        // Check if this is a new personal best
        const { user, progress } = useUserStore.getState();
        if (user) {
          const currentPB = progress.personalBests[exerciseId];
          if (!currentPB || newSet.oneRepMax > currentPB.oneRepMax) {
            // Update personal best
            const updatedPBs = {
              ...progress.personalBests,
              [exerciseId]: newSet
            };
            
            // Calculate new rank
            const exercise = get().exercises.find(e => e.id === exerciseId);
            if (exercise) {
              const rank = calculateStrengthRank(exercise.id, newSet.oneRepMax, user.gender);
              const updatedRanks = {
                ...progress.strengthRanks,
                [exerciseId]: rank
              };
              
              useUserStore.getState().updateProgress({
                personalBests: updatedPBs,
                strengthRanks: updatedRanks
              });
            }
          }
        }
      },
      
      updateWorkoutLog: (logId, updates) => {
        set((state) => ({
          logs: state.logs.map(log => 
            log.id === logId ? { ...log, ...updates } : log
          )
        }));
      },
      
      deleteWorkoutLog: (logId) => {
        set((state) => ({
          logs: state.logs.filter(log => log.id !== logId)
        }));
      },
      
      getExercisesByMuscleGroup: (muscleGroup) => {
        return get().exercises.filter(exercise => exercise.muscleGroup === muscleGroup);
      },
      
      getRecentWorkouts: (limit = 5) => {
        return [...get().logs]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      }
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function to update user progress based on workout data
function updateUserProgress(workoutLog: WorkoutLog) {
  const { progress } = useUserStore.getState();
  const { exercises } = useWorkoutStore.getState();
  
  // Calculate muscle group progress based on workout volume
  const muscleGroupVolume: Record<string, number> = {
    chest: 0,
    back: 0,
    legs: 0,
    arms: 0,
    core: 0
  };
  
  // Count total volume per muscle group
  workoutLog.exercises.forEach(ex => {
    const exercise = exercises.find(e => e.id === ex.exerciseId);
    if (exercise) {
      const totalVolume = ex.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      muscleGroupVolume[exercise.muscleGroup] += totalVolume;
    }
  });
  
  // Convert volume to progress percentage (simplified)
  const updatedMuscleGroups = { ...progress.muscleGroups };
  Object.keys(muscleGroupVolume).forEach(group => {
    if (muscleGroupVolume[group] > 0) {
      // Increase progress by some amount based on volume
      // This is a simplified approach - in a real app you'd want a more sophisticated algorithm
      const progressIncrease = Math.min(5, muscleGroupVolume[group] / 1000);
      updatedMuscleGroups[group] = Math.min(100, updatedMuscleGroups[group] + progressIncrease);
    }
  });
  
  useUserStore.getState().updateProgress({
    muscleGroups: updatedMuscleGroups
  });
}