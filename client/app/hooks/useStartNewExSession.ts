import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExerciseSessionResponse } from "../types";
import { fetchWithAuth } from "../util/fetchWithAuth";

export const useStartNewExSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await fetchWithAuth("/exercise-session", {
        method: "POST",
      });
    },
    onSuccess: (data: ExerciseSessionResponse) => {
      queryClient.setQueryData(["getExerciseSession"], data);
    },
  });
};
