import Box from "@mui/material/Box";
import { Exercise } from "app/types";
import { useGetExerciseSession } from "../../hooks/useGetExerciseSession";

const getRepRangeStatus = (exercise: Exercise, rep: number) => {
  const min = exercise.targetRepsMin || 0;
  const max = exercise.targetRepsMax || min;

  if (rep < min) {
    return { statusColor: "red", statusLabel: "Lower Than Range" };
  } else if (rep > max) {
    return { statusColor: "orange", statusLabel: "Higher Than Range" };
  } else {
    return { statusColor: "green", statusLabel: "In Range" };
  }
};

export const SavedReps = ({ exercise }: { exercise: Exercise }) => {
  const { data: exerciseSession } = useGetExerciseSession();
  const savedReps = exerciseSession?.data;
  const exerciseReps = savedReps?.[exercise.key]?.reps || [];

  if (exerciseReps.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", fontSize: "12px" }}>
      {exerciseReps.map((rep: number, index: number) => {
        const key = exercise.key + "-" + index;

        const { statusColor, statusLabel } = getRepRangeStatus(exercise, rep);

        const repAriaLabel = `${exercise.name} ${rep} Reps ${statusLabel}`;
        const setLabel = `Set ${index + 1}:`;

        return (
          <Box
            key={key}
            sx={{ display: "flex", flexDirection: "row", mr: 1, mb: 1.5 }}
          >
            <Box sx={{ mr: 0.75, color: "#b9b9b9" }}>{setLabel}</Box>

            <Box
              sx={{ fontWeight: "500", color: statusColor }}
              aria-label={repAriaLabel}
            >
              {rep}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
