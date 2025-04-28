import { WorkoutLog } from '@/types/workout';

export const mockWorkoutLogs: WorkoutLog[] = [
  {
    id: 'workout1',
    date: '2023-11-20T10:00:00.000Z',
    exercises: [
      {
        exerciseId: 'bench-press',
        sets: [
          {
            id: 'set1',
            exerciseId: 'bench-press',
            weight: 80,
            reps: 10,
            date: '2023-11-20T10:10:00.000Z',
            oneRepMax: 106.7
          },
          {
            id: 'set2',
            exerciseId: 'bench-press',
            weight: 90,
            reps: 8,
            date: '2023-11-20T10:15:00.000Z',
            oneRepMax: 113.8
          },
          {
            id: 'set3',
            exerciseId: 'bench-press',
            weight: 100,
            reps: 6,
            date: '2023-11-20T10:20:00.000Z',
            oneRepMax: 120
          }
        ]
      },
      {
        exerciseId: 'incline-bench-press',
        sets: [
          {
            id: 'set4',
            exerciseId: 'incline-bench-press',
            weight: 70,
            reps: 10,
            date: '2023-11-20T10:30:00.000Z',
            oneRepMax: 93.3
          },
          {
            id: 'set5',
            exerciseId: 'incline-bench-press',
            weight: 75,
            reps: 8,
            date: '2023-11-20T10:35:00.000Z',
            oneRepMax: 94.8
          },
          {
            id: 'set6',
            exerciseId: 'incline-bench-press',
            weight: 80,
            reps: 6,
            date: '2023-11-20T10:40:00.000Z',
            oneRepMax: 96
          }
        ]
      }
    ],
    notes: '胸の日。ベンチプレスの最後のセットは重かった。'
  },
  {
    id: 'workout2',
    date: '2023-11-22T11:00:00.000Z',
    exercises: [
      {
        exerciseId: 'squat',
        sets: [
          {
            id: 'set7',
            exerciseId: 'squat',
            weight: 100,
            reps: 10,
            date: '2023-11-22T11:10:00.000Z',
            oneRepMax: 133.3
          },
          {
            id: 'set8',
            exerciseId: 'squat',
            weight: 120,
            reps: 8,
            date: '2023-11-22T11:15:00.000Z',
            oneRepMax: 151.7
          },
          {
            id: 'set9',
            exerciseId: 'squat',
            weight: 140,
            reps: 6,
            date: '2023-11-22T11:20:00.000Z',
            oneRepMax: 168
          }
        ]
      },
      {
        exerciseId: 'leg-press',
        sets: [
          {
            id: 'set10',
            exerciseId: 'leg-press',
            weight: 150,
            reps: 12,
            date: '2023-11-22T11:30:00.000Z',
            oneRepMax: 210
          },
          {
            id: 'set11',
            exerciseId: 'leg-press',
            weight: 180,
            reps: 10,
            date: '2023-11-22T11:35:00.000Z',
            oneRepMax: 240
          },
          {
            id: 'set12',
            exerciseId: 'leg-press',
            weight: 200,
            reps: 8,
            date: '2023-11-22T11:40:00.000Z',
            oneRepMax: 252.9
          }
        ]
      }
    ],
    notes: '脚の日。スクワットのフォームが良くなってきた。'
  },
  {
    id: 'workout3',
    date: '2023-11-24T09:00:00.000Z',
    exercises: [
      {
        exerciseId: 'deadlift',
        sets: [
          {
            id: 'set13',
            exerciseId: 'deadlift',
            weight: 120,
            reps: 8,
            date: '2023-11-24T09:10:00.000Z',
            oneRepMax: 151.7
          },
          {
            id: 'set14',
            exerciseId: 'deadlift',
            weight: 140,
            reps: 6,
            date: '2023-11-24T09:15:00.000Z',
            oneRepMax: 168
          },
          {
            id: 'set15',
            exerciseId: 'deadlift',
            weight: 160,
            reps: 4,
            date: '2023-11-24T09:20:00.000Z',
            oneRepMax: 177.8
          }
        ]
      },
      {
        exerciseId: 'barbell-row',
        sets: [
          {
            id: 'set16',
            exerciseId: 'barbell-row',
            weight: 80,
            reps: 10,
            date: '2023-11-24T09:30:00.000Z',
            oneRepMax: 106.7
          },
          {
            id: 'set17',
            exerciseId: 'barbell-row',
            weight: 90,
            reps: 8,
            date: '2023-11-24T09:35:00.000Z',
            oneRepMax: 113.8
          },
          {
            id: 'set18',
            exerciseId: 'barbell-row',
            weight: 100,
            reps: 6,
            date: '2023-11-24T09:40:00.000Z',
            oneRepMax: 120
          }
        ]
      }
    ],
    notes: '背中の日。デッドリフトの最後のセットは自己ベスト更新！'
  }
];