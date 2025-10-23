import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../util/fetchWithAuth";
import { ExerciseSessionResponse, SavedReps } from "app/types";

export const useUpdateExerciseSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { [key: string]: SavedReps }) => {
      return await fetchWithAuth("/exercise-session", {
        method: "PUT",
        body: JSON.stringify({ data }),
      });
    },
    onMutate: (newData: { [key: string]: SavedReps }) => {
      queryClient.setQueryData(
        ["getExerciseSession"],
        (oldData: ExerciseSessionResponse) => ({
          ...oldData,
          data: newData,
        })
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["getExerciseSession"], data);
    },
  });
};
