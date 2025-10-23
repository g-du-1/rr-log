"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert } from "@mui/material";
import { Exercise } from "../types";
import { RepsModal } from "./RepsModal";
import { TopBar } from "./TopBar";
import { StartTime } from "./StartTime";
import { CardExerciseMedia } from "./card/CardExerciseMedia";
import { CardHeading } from "./card/CardHeading";
import { SavedReps } from "./card/SavedReps";
import { CardComments } from "./card/CardComments";
import { useBoundStore } from "../store/store";
import { FinishTime } from "./FinishTime";
import { useGetUserExercises } from "../hooks/useGetUserExercises";
import { useGetUserSettings } from "../hooks/useGetUserSettings";
import { useGetExerciseSession } from "../hooks/useGetExerciseSession";

export const ExerciseTracker = () => {
  const { data: exercisesWithIds, isLoading, error } = useGetUserExercises();
  const { data: userSettings } = useGetUserSettings();

  const exercises = exercisesWithIds?.map(({ exercise }) => exercise);

  const { data: exerciseSession } = useGetExerciseSession();
  const savedReps = exerciseSession?.data;

  const setSelectedExercise = useBoundStore(
    (state) => state.setSelectedExercise
  );
  const setModalOpen = useBoundStore((state) => state.setModalOpen);

  const handleExerciseClick = (selectedExercise: Exercise) => {
    setSelectedExercise(selectedExercise);
    setModalOpen(true);
  };

  const isExerciseCompleted = (exercise: Exercise) => {
    return (
      (savedReps?.[exercise.key]?.reps?.length ?? 0) >= exercise.targetSets
    );
  };

  const shouldShowExercise = (exercise: Exercise) => {
    const completed = isExerciseCompleted(exercise);
    return userSettings?.showCompletedExercises || !completed;
  };

  const shouldShowDivider = (
    currentExercise: Exercise,
    nextExercise: Exercise
  ) => {
    return currentExercise.category !== nextExercise.category;
  };

  const renderExerciseCard = (exercise: Exercise, index: number) => {
    const completed = isExerciseCompleted(exercise);
    const nextExercise = exercises?.[index + 1];

    const visibleStyles = {};
    const hiddenStyles = { display: "none" };

    const wrapperStyles = shouldShowExercise(exercise)
      ? visibleStyles
      : hiddenStyles;

    const ariaLabel = `Open ${exercise.name} Modal`;

    return (
      <Box key={exercise.key} sx={wrapperStyles}>
        <Card sx={{ mb: 2 }}>
          <CardExerciseMedia exercise={exercise} />

          <CardContent
            sx={{
              p: 1,
              cursor: "pointer",
              "&:last-child": { pb: 1 },
            }}
            aria-label={ariaLabel}
            onClick={() => handleExerciseClick(exercise)}
          >
            <CardHeading exercise={exercise} exerciseCompleted={completed} />

            <SavedReps exercise={exercise} />

            {userSettings?.showComments && exercise.comments && (
              <CardComments comments={exercise.comments} />
            )}
          </CardContent>
        </Card>

        {nextExercise && shouldShowDivider(exercise, nextExercise) && (
          <Divider
            flexItem
            sx={{
              mb: 2,
              borderBottomWidth: 2,
            }}
          />
        )}
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box mx="auto" my={2} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  const hasError = error && error.message !== "";
  const hasExercises = exercises && exercises.length > 0;
  const hasNoExercises = !hasExercises;

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mt: 7 }}>
        <TopBar />

        {hasError && (
          <Alert severity="error" sx={{ marginY: 2 }}>
            {error.message}
          </Alert>
        )}

        {hasNoExercises ? (
          <Box textAlign="center">No exercises.</Box>
        ) : (
          <>
            {exercises.map((exercise, index) =>
              renderExerciseCard(exercise, index)
            )}

            <StartTime />
            <FinishTime exercises={exercises} />
            <RepsModal exercises={exercises} />
          </>
        )}
      </Box>
    </Box>
  );
};
