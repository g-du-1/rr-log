import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Exercise } from "app/types";
import * as React from "react";
import { getFormattedTime } from "../util/getFormattedTime";
import { useBoundStore } from "../store/store";
import { useUpdateExerciseSession } from "../hooks/useUpdateExerciseSession";
import { useGetExerciseSession } from "../hooks/useGetExerciseSession";

type Props = {
  exercises: Exercise[];
};

export const RepsModal = ({ exercises }: Props) => {
  const fieldValue = useBoundStore((state) => state.fieldValue);
  const modalOpen = useBoundStore((state) => state.modalOpen);
  const selectedExercise = useBoundStore((state) => state.selectedExercise);
  const setFieldValue = useBoundStore((state) => state.setFieldValue);
  const setModalOpen = useBoundStore((state) => state.setModalOpen);
  const startStopwatch = useBoundStore((state) => state.startStopwatch);
  const resetStopwatch = useBoundStore((state) => state.resetStopwatch);
  const updateExerciseSession = useUpdateExerciseSession();
  const { data: exerciseSession } = useGetExerciseSession();
  const savedReps = exerciseSession?.data;

  if (!selectedExercise) {
    return null;
  }

  const handleModalClose = () => {
    const fieldValNum = parseInt(fieldValue);

    if (selectedExercise && fieldValNum) {
      const newReps = { ...savedReps };

      const exercise = newReps[selectedExercise.key];

      if (exercise) {
        exercise.reps.push(parseInt(fieldValue));
      } else {
        newReps[selectedExercise.key] = {
          name: selectedExercise.name,
          reps: [fieldValNum],
        };
      }

      updateExerciseSession.mutate(newReps);

      if (selectedExercise.category !== "WARM_UP") {
        resetStopwatch();

        const isLastExercise =
          exercises[exercises.length - 1].key === selectedExercise.key;

        const reachedTargetSets =
          savedReps?.[selectedExercise.key]?.reps.length ===
          selectedExercise.targetSets;

        const shouldStartStopwatch = !(isLastExercise && reachedTargetSets);

        if (shouldStartStopwatch) {
          startStopwatch();
        }
      }
    }

    setModalOpen(false);
    setFieldValue("");
  };

  const handleDeleteRepsClick = (selectedExercise: Exercise) => {
    const newReps = { ...savedReps };
    const exerciseKey = selectedExercise.key;
    const existingExercise = newReps[exerciseKey];

    if (existingExercise) {
      existingExercise.reps = [];
      updateExerciseSession.mutate(newReps);
    }

    setModalOpen(false);

    resetStopwatch();
  };

  const hasReps = (savedReps?.[selectedExercise.key]?.reps?.length ?? 0) > 0;

  return (
    <Dialog
      open={modalOpen}
      onClose={handleModalClose}
      disableRestoreFocus
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleModalClose();
          },
        },
      }}
    >
      <DialogTitle>Add {selectedExercise.name} Reps</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Add Reps"
          type="number"
          fullWidth
          variant="standard"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        {hasReps && (
          <IconButton
            color="error"
            size="large"
            aria-label="Delete Reps"
            onClick={() => handleDeleteRepsClick(selectedExercise)}
          >
            <DeleteIcon />
          </IconButton>
        )}

        <Button onClick={() => setModalOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
