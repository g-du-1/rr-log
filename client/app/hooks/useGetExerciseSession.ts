import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../util/fetchWithAuth";
import { ExerciseSessionResponse } from "../types";
import { APIError } from "../errors/APIError";

export const useGetExerciseSession = () => {
  return useQuery<ExerciseSessionResponse, APIError>({
    queryKey: ["getExerciseSession"],
    queryFn: async () => {
      return await fetchWithAuth("/exercise-session");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
