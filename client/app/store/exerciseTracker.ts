import { Exercise } from "app/types";
import { StateCreator } from "zustand";

export interface ExerciseTrackerSlice {
  selectedExercise: Exercise | null;
  setSelectedExercise: (newValue: Exercise) => void;
}

export const createExerciseTrackerSlice: StateCreator<
  ExerciseTrackerSlice,
  [],
  [],
  ExerciseTrackerSlice
> = (set) => ({
  selectedExercise: null,
  setSelectedExercise: (newValue) => set({ selectedExercise: newValue }),
});
