import Box from "@mui/material/Box";
import { useGetExerciseSession } from "../hooks/useGetExerciseSession";

export const StartTime = () => {
  const { data } = useGetExerciseSession();
  const createdAt = data?.createdAt;
  const startTime = createdAt && new Date(createdAt).toLocaleString();

  if (startTime) {
    return (
      <Box textAlign={"center"} fontWeight={500} mb={1}>
        Started: {startTime}
      </Box>
    );
  }

  return null;
};
