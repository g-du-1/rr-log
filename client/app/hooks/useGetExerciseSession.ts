import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../util/fetchWithAuth";
import { APIError } from "../errors/APIError";
import { ExerciseSession } from "../types";

export const useGetExerciseSession = () => {
  return useQuery<ExerciseSession, APIError>({
    queryKey: ["getExerciseSession"],
    queryFn: async () => {
      return await fetchWithAuth("/exercise-session");
    },
  });
};
