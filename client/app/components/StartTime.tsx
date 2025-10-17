import Box from "@mui/material/Box";
import { useGetExerciseSession } from "../hooks/useGetExerciseSession";

export const StartTime = () => {
  const { data } = useGetExerciseSession();
  const createdAt = data?.createdAt;

  if (createdAt) {
    return (
      <Box textAlign={"center"} fontWeight={500} mb={1}>
        Started: {new Date(createdAt).toLocaleString()}
      </Box>
    );
  }

  return null;
};
