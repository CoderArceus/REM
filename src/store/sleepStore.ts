import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SleepOption } from '@/utils/sleepMath';

interface SleepState {
  wakeTime: string;
  selectedCycles: number;
  history: { wakeTime: string; bedtime: string; cycles: number; date: string }[];
  setWakeTime: (time: string) => void;
  setSelectedCycles: (cycles: number) => void;
  addToHistory: (entry: SleepState['history'][0]) => void;
  clearHistory: () => void;
}

export const useSleepStore = create<SleepState>()(
  persist(
    (set) => ({
      wakeTime: '07:00',
      selectedCycles: 5,
      history: [],
      setWakeTime: (time) => set({ wakeTime: time }),
      setSelectedCycles: (cycles) => set({ selectedCycles: cycles }),
      addToHistory: (entry) =>
        set((state) => ({
          history: [entry, ...state.history.slice(0, 9)]
        })),
      clearHistory: () => set({ history: [] })
    }),
    { name: 'rem-sleep-storage' }
  )
);
