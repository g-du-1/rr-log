import AppBar from "@mui/material/AppBar";
import { StopWatch } from "./StopWatch";
import { SideMenu } from "./SideMenu";
import Button from "@mui/material/Button";
import { useStartExerciseSession } from "../hooks/useStartExerciseSession";

export const TopBar = () => {
  const mutation = useStartExerciseSession();

  return (
    <AppBar
      position="fixed"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        opacity: 0.9,
        color: "text.primary",
        background: "#fff",
      }}
    >
      <StopWatch />

      <Button
        onClick={() => {
          mutation.mutate();
        }}
      >
        Start
      </Button>

      <SideMenu />
    </AppBar>
  );
};
