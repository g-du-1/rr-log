import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../util/fetchWithAuth";
import { ExerciseSession, SavedReps } from "app/types";

export const useUpdateExerciseSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { [key: string]: SavedReps }) => {
      return await fetchWithAuth("/exercise-session", {
        method: "PUT",
        body: JSON.stringify({ data }),
      });
    },
    onMutate: (newExerciseSession) => {
      queryClient.setQueryData(
        ["getExerciseSession"],
        (oldData: ExerciseSession) => ({
          ...oldData,
          data: newExerciseSession,
        })
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["getExerciseSession"], data);
    },
    onError: (error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["getExerciseSession"] });
    },
  });
};
