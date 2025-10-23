import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExerciseSession } from "../types";
import { fetchWithAuth } from "../util/fetchWithAuth";

export const useStartExerciseSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await fetchWithAuth("/exercise-session", {
        method: "POST",
      });
    },
    onSuccess: (data: ExerciseSession) => {
      queryClient.setQueryData(["getExerciseSession"], data);
    },
  });
};
