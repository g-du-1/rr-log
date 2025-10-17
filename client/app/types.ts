type ExerciseCategory =
  | "WARM_UP"
  | "FIRST_PAIR"
  | "SECOND_PAIR"
  | "THIRD_PAIR"
  | "CORE_TRIPLET";

type ExerciseType =
  | "WARM_UP"
  | "PULL_UP"
  | "SQUAT"
  | "DIP"
  | "HINGE"
  | "ROW"
  | "PUSH_UP"
  | "ANTI_EXTENSION"
  | "ANTI_ROTATION"
  | "EXTENSION";

export type Exercise = {
  id: number;
  key: string;
  name: string;
  type: ExerciseType;
  category: ExerciseCategory;
  comments: string | null;
  mediaLink: string;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number | null;
  duration: boolean;
  targetRest: number;
  additionalRest: number;
};

export type UserExercise = {
  id: number;
  exercise: Exercise;
};

export type SavedReps = {
  name: string;
  reps: number[];
};

export enum Role {
  ROLE_ADMIN,
  ROLE_USER,
}

export type User = {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  roles: Role[];
};

export type UserSettings = {
  showCompletedExercises: boolean;
  showComments: boolean;
  showMedia: boolean;
};

export type SignInResponse = {
  status: number;
  message?: string;
};

export type ExerciseSession = {
  id: number;
  active: boolean;
  data: string;
};
