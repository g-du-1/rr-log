import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Checkbox from "@mui/material/Checkbox";
import { useRouter } from "next/navigation";
import Divider from "@mui/material/Divider";
import HouseIcon from "@mui/icons-material/House";
import { useGetUserSettings } from "../hooks/useGetUserSettings";
import { useSaveUserSettings } from "../hooks/useSaveUserSettings";
import { useStartExerciseSession } from "../hooks/useStartExerciseSession";

export const SideMenu = () => {
  const router = useRouter();

  const { data: userSettings } = useGetUserSettings();

  const saveUserSettingsMutation = useSaveUserSettings();
  const startExSessionMutation = useStartExerciseSession();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  if (!userSettings) {
    return null;
  }

  const { showCompletedExercises, showMedia, showComments } =
    userSettings || {};

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key={"Home Page"} disablePadding>
          <ListItemButton
            aria-label="Home Page"
            onClick={() => {
              router.push("/");
            }}
          >
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <HouseIcon />
            </ListItemIcon>

            <ListItemText primary={"Home Page"} sx={{ paddingLeft: ".5rem" }} />
          </ListItemButton>
        </ListItem>

        <ListItem key={"Settings Page"} disablePadding>
          <ListItemButton
            aria-label="Settings Page"
            onClick={() => {
              router.push("/settings");
            }}
          >
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <SettingsIcon />
            </ListItemIcon>

            <ListItemText
              primary={"Settings Page"}
              sx={{ paddingLeft: ".5rem" }}
            />
          </ListItemButton>
        </ListItem>

        <Divider />

        <ListItem key={"New Exercise Session"} disablePadding>
          <ListItemButton
            aria-label={`Start New Exercise Session`}
            onClick={() => startExSessionMutation.mutate()}
          >
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <FitnessCenterIcon />
            </ListItemIcon>

            <ListItemText
              primary={"New Session"}
              sx={{ paddingLeft: ".5rem" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem key={"Show Completed"} disablePadding>
          <ListItemButton
            aria-label={`Show completed exercises is ${showCompletedExercises ? "on" : "off"}`}
            onClick={() =>
              saveUserSettingsMutation.mutate({
                ...userSettings,
                showCompletedExercises: !showCompletedExercises,
              })
            }
          >
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <Checkbox
                slotProps={{
                  input: {
                    "aria-label": "Show completed exercises checkbox",
                  },
                }}
                color="default"
                checked={showCompletedExercises}
              />
            </ListItemIcon>

            <ListItemText
              primary={"Show Completed"}
              sx={{ paddingLeft: ".5rem" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem key={"Show Comments"} disablePadding>
          <ListItemButton
            aria-label={`Show comments is ${showComments ? "on" : "off"}`}
            onClick={() =>
              saveUserSettingsMutation.mutate({
                ...userSettings,
                showComments: !showComments,
              })
            }
          >
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <Checkbox
                slotProps={{
                  input: {
                    "aria-label": "Show comments checkbox",
                  },
                }}
                color="default"
                checked={showComments}
              />
            </ListItemIcon>

            <ListItemText
              primary={"Show Comments"}
              sx={{ paddingLeft: ".5rem" }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem key={"Show Media"} disablePadding>
          <ListItemButton
            aria-label={`Show media is ${showMedia ? "on" : "off"}`}
            onClick={() =>
              saveUserSettingsMutation.mutate({
                ...userSettings,
                showMedia: !showMedia,
              })
            }
          >
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <Checkbox
                slotProps={{
                  input: {
                    "aria-label": "Show media checkbox",
                  },
                }}
                color="default"
                checked={showMedia}
              />
            </ListItemIcon>

            <ListItemText
              primary={"Show Media"}
              sx={{ paddingLeft: ".5rem" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        size="large"
        aria-label="Open Menu"
        onClick={toggleDrawer(true)}
      >
        <SettingsIcon />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
};
