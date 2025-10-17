import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "../util/fetchWithAuth";

export const useStartExerciseSession = () => {
  return useMutation({
    mutationFn: async () => {
      return await fetchWithAuth("/exercise-session/start", {
        method: "POST",
      });
    },
  });
};
