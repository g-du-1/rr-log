import { Exercise, SavedReps } from "app/types";
import { StateCreator } from "zustand";

export interface ExerciseTrackerSlice {
  selectedExercise: Exercise | null;
  savedReps: {
    [key: string]: SavedReps;
  };
  setSelectedExercise: (newValue: Exercise) => void;
  setSavedReps: (newValue: { [key: string]: SavedReps }) => void;
}

export const createExerciseTrackerSlice: StateCreator<
  ExerciseTrackerSlice,
  [],
  [],
  ExerciseTrackerSlice
> = (set) => ({
  selectedExercise: null,
  savedReps: {},
  setSavedReps: (newValue) => set({ savedReps: newValue }),
  setSelectedExercise: (newValue) => set({ selectedExercise: newValue }),
});
