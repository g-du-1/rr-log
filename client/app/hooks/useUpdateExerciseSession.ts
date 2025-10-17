import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../util/fetchWithAuth";

export const useUpdateExerciseSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return await fetchWithAuth("/exercise-session", {
        method: "PUT",
        body: JSON.stringify({ data }),
      });
    },
    onMutate: (newExerciseSession) => {
      queryClient.setQueryData(["getExerciseSession"], {
        data: newExerciseSession,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["getExerciseSession"], data);
    },
    onError: (error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["getExerciseSession"] });
    },
  });
};
