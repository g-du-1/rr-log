import { Exercise } from "app/types";
import { StateCreator } from "zustand";

export interface ExerciseTrackerSlice {
  selectedExercise: Exercise | null;
  savedStartTime: string;
  setSelectedExercise: (newValue: Exercise) => void;
  setSavedStartTime: (newValue: string) => void;
}

export const createExerciseTrackerSlice: StateCreator<
  ExerciseTrackerSlice,
  [],
  [],
  ExerciseTrackerSlice
> = (set) => ({
  selectedExercise: null,
  savedStartTime: "",
  setSelectedExercise: (newValue) => set({ selectedExercise: newValue }),
  setSavedStartTime: (newValue) => set({ savedStartTime: newValue }),
});
