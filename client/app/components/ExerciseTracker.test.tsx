import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ExerciseTracker } from "./ExerciseTracker";
import { getFormattedTime } from "../util/getFormattedTime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Mock, vi } from "vitest";
import { useRouter } from "next/navigation";
import nock from "nock";
import {
  nockBaseUrl,
  saveUserSettings,
  userExercises,
  getUserSettings,
  startNewExerciseSession,
} from "../nockFixtures";

const mockPush = vi.fn();

const mockPlay = vi.fn().mockResolvedValue(undefined);

global.Audio = vi.fn().mockImplementation(() => ({
  play: mockPlay,
}));

Object.defineProperty(window, "HTMLMediaElement", {
  writable: true,
  value: {
    prototype: {
      play: mockPlay,
    },
  },
});

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const DELETE_REPS = "Delete Reps";

const getModalOpenTriggers = () => screen.getAllByLabelText(/^Open .* Modal$/);

const clickOpenModalTrigger = (idx: number) => {
  const openModalTriggers = getModalOpenTriggers();

  fireEvent.click(openModalTriggers[idx]);
};

const getRepsInput = () => {
  const input = screen.getByLabelText("Add Reps");
  expect(input).toHaveFocus();

  return input;
};

const submitReps = (val: string) => {
  const input = getRepsInput();
  fireEvent.change(input, { target: { value: val } });
  fireEvent.submit(input);
};

const getDeleteRepsBtn = () => screen.getByLabelText(DELETE_REPS);

const clickDeleteReps = () => fireEvent.click(getDeleteRepsBtn());

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderExerciseTracker = async () => {
  const renderResult = render(<ExerciseTracker />, { wrapper });

  await waitFor(() => {
    expect(screen.getByLabelText("Open Menu")).toBeInTheDocument();
  });

  return renderResult;
};

// TODO: Make tests more maintainable

describe("ExerciseTracker", async () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
      toFake: [
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval",
        "Date",
      ],
    });

    process.env.NEXT_PUBLIC_ENABLE_API_CONNECTION = "true";
    process.env.NEXT_PUBLIC_API_PREFIX = "http://localhost:3000/api/v1";

    (useRouter as Mock).mockImplementation(() => ({
      push: mockPush,
    }));

    nock(nockBaseUrl)
      .get(userExercises.path)
      .reply(userExercises.success.status, userExercises.success.response);

    nock(nockBaseUrl)
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, getUserSettings.success.response);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
    vi.clearAllMocks();
    nock.cleanAll();
  });

  it("matches snapshot", async () => {
    await renderExerciseTracker();

    fireEvent.click(screen.getByLabelText("Open Menu"));

    expect(document.body).toMatchSnapshot();
  });

  it("outputs open modal triggers for each exercise", async () => {
    await renderExerciseTracker();

    expect(getModalOpenTriggers()).toHaveLength(3);
  });

  it("open modal trigger opens a modal on click for the exercise", async () => {
    await renderExerciseTracker();

    fireEvent.click(getModalOpenTriggers()[0]);

    expect(screen.getByText("Add GMB Wrist Prep Reps")).toBeDefined();
  });

  it("does not display media by default", async () => {
    nock.cleanAll();

    nock(nockBaseUrl)
      .get(userExercises.path)
      .reply(userExercises.success.status, userExercises.success.response)
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, {
        showCompletedExercises: false,
        showComments: false,
        showMedia: false,
      });

    await renderExerciseTracker();

    expect(screen.queryByTitle("GMB Wrist Prep Video")).not.toBeVisible();
    expect(screen.queryByTitle("Arch Hangs Video")).not.toBeVisible();
    expect(
      screen.queryByAltText("Parallel Bar Support Hold Image"),
    ).not.toBeVisible();
  });

  it("displays media when show media is clicked", async () => {
    nock.cleanAll();

    nock(nockBaseUrl)
      .get(userExercises.path)
      .reply(userExercises.success.status, userExercises.success.response)
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, {
        showCompletedExercises: false,
        showComments: false,
        showMedia: false,
      })
      .post(saveUserSettings.path)
      .reply(saveUserSettings.success.status, {
        showCompletedExercises: false,
        showComments: false,
        showMedia: true,
      });

    await renderExerciseTracker();

    fireEvent.click(screen.getByLabelText("Open Menu"));
    fireEvent.click(screen.getByLabelText("Show media is off"));

    await waitFor(() => {
      expect(screen.getByTitle("GMB Wrist Prep Video")).toBeVisible();
    });

    expect(screen.getByTitle("Arch Hangs Video")).toBeVisible();
    expect(
      screen.getByAltText("Parallel Bar Support Hold Image"),
    ).toBeVisible();
  });

  it("renders category separators when category changes", async () => {
    await renderExerciseTracker();

    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });

  it("saves and resets sets of reps for an exercise", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    submitReps("7");

    clickOpenModalTrigger(1);

    submitReps("6");

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();

    clickOpenModalTrigger(1);

    clickDeleteReps();

    expect(screen.queryByText("7")).not.toBeInTheDocument();
    expect(screen.queryByText("6")).not.toBeInTheDocument();
  });

  it("saves reps on modal close", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    const repsInput = getRepsInput();

    fireEvent.change(repsInput, { target: { value: "8" } });

    fireEvent.keyDown(repsInput, {
      key: "Escape",
      code: "Escape",
    });

    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("does not save reps on cancel click", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    const repsInput = getRepsInput();

    fireEvent.change(repsInput, { target: { value: "8" } });

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("8")).not.toBeInTheDocument();
  });

  it("only renders the delete reps icon if there are reps saved and closes the modal on save", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    expect(screen.queryByLabelText(DELETE_REPS)).not.toBeInTheDocument();

    submitReps("6");

    clickOpenModalTrigger(1);

    expect(screen.getByLabelText(DELETE_REPS)).toBeInTheDocument();

    clickDeleteReps();

    expect(screen.queryByText("Add Arch Hangs Reps")).not.toBeVisible();
  });

  it("starts the stopwatch when saving reps", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    submitReps("6");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText("00:00:05")).toBeInTheDocument();
  });

  it("does not start the stopwatch when saving a warmup", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(0);

    submitReps("6");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
  });

  it("starts and stops the stopwatch", async () => {
    await renderExerciseTracker();

    expect(
      screen.getByRole("button", {
        name: /stop stopwatch/i,
      }),
    ).toBeDisabled();

    fireEvent.click(
      screen.getByRole("button", {
        name: /restart stopwatch/i,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByText(/00:00:08/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /stop stopwatch/i,
      }),
    ).toBeEnabled();

    fireEvent.click(
      screen.getByRole("button", {
        name: /stop stopwatch/i,
      }),
    );

    expect(screen.getByText(/00:00:00/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /stop stopwatch/i,
      }),
    ).toBeDisabled();
  });

  it("resets stopwatch", async () => {
    await renderExerciseTracker();

    fireEvent.click(
      screen.getByRole("button", {
        name: /restart stopwatch/i,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByText(/00:00:08/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /restart stopwatch/i,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText(/00:00:03/i)).toBeInTheDocument();
  });

  it("displays a done elem when the saved sets reach the target sets", async () => {
    await renderExerciseTracker();

    expect(
      screen.queryByLabelText("Exercise Completed"),
    ).not.toBeInTheDocument();

    clickOpenModalTrigger(0);

    submitReps("6");

    expect(screen.getByLabelText("Exercise Completed")).toBeInTheDocument();
  });

  it("displays warning after the target rest has passed", async () => {
    await renderExerciseTracker();

    expect(screen.queryByAltText("Rest Time Passed")).not.toBeInTheDocument();

    expect(
      screen.queryByAltText("Additional Rest Time Passed"),
    ).not.toBeInTheDocument();

    clickOpenModalTrigger(1);

    submitReps("6");

    act(() => {
      vi.advanceTimersByTime(90000);
    });

    expect(screen.getByLabelText("Rest Time Passed")).toBeInTheDocument();

    expect(
      screen.queryByLabelText("Additional Rest Time Passed"),
    ).not.toBeInTheDocument();
  });

  it("does not display rest time warning after adding reps to a warmup", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(0);

    submitReps("6");

    fireEvent.click(screen.getByLabelText(/restart stopwatch/i));

    act(() => {
      vi.advanceTimersByTime(100000);
    });

    expect(screen.queryByLabelText("Rest Time Passed")).not.toBeInTheDocument();

    expect(
      screen.queryByLabelText("Additional Rest Time Passed"),
    ).not.toBeInTheDocument();
  });

  it("displays a more severe warning when additional rest time is passed", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    submitReps("6");

    act(() => {
      vi.advanceTimersByTime(200000);
    });

    expect(screen.queryByLabelText("Rest Time Passed")).not.toBeInTheDocument();

    expect(
      screen.getByLabelText("Additional Rest Time Passed"),
    ).toBeInTheDocument();
  });

  it("resets the timer when reps are deleted", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    submitReps("6");

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    clickOpenModalTrigger(1);

    clickDeleteReps();

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
  });

  it("displays target sets", async () => {
    await renderExerciseTracker();

    expect(screen.getByText("1x10")).toBeInTheDocument();
    expect(screen.getByText("3x5-8")).toBeInTheDocument();
    expect(screen.getByText("3x60s")).toBeInTheDocument();
  });

  it("adds label for in range reps", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    submitReps("6");

    expect(
      screen.getByLabelText("Arch Hangs 6 Reps In Range"),
    ).toBeInTheDocument();
  });

  it("adds label for out of range reps - lower", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    submitReps("3");

    expect(
      screen.getByLabelText("Arch Hangs 3 Reps Lower Than Range"),
    ).toBeInTheDocument();
  });

  it("adds label for out of range reps - higher", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    submitReps("35");

    expect(
      screen.getByLabelText("Arch Hangs 35 Reps Higher Than Range"),
    ).toBeInTheDocument();
  });

  it("adds label for cases without max target step", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(0);

    submitReps("10");

    expect(
      screen.getByLabelText("GMB Wrist Prep 10 Reps In Range"),
    ).toBeInTheDocument();
  });

  it("hides completed exercises if hiding is turned on", async () => {
    nock(nockBaseUrl)
      .post(saveUserSettings.path)
      .reply(saveUserSettings.success.status, {
        showCompletedExercises: false,
        showComments: false,
        showMedia: false,
      });

    await renderExerciseTracker();

    expect(screen.getByText("GMB Wrist Prep")).toBeVisible();
    expect(screen.getByText("Arch Hangs")).toBeVisible();
    expect(screen.getByText("Parallel Bar Support Hold")).toBeVisible();

    clickOpenModalTrigger(0);

    submitReps("8");

    fireEvent.click(screen.getByLabelText("Open Menu"));
    const checkbox = screen.getByLabelText("Show completed exercises checkbox");
    expect(checkbox).toBeChecked();

    fireEvent.click(screen.getByLabelText("Show completed exercises is on"));

    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
    });

    expect(screen.getByText("GMB Wrist Prep")).not.toBeVisible();
    expect(screen.getByText("Arch Hangs")).toBeVisible();
    expect(screen.getByText("Parallel Bar Support Hold")).toBeVisible();
  });

  it("saves and renders start time", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(0);

    submitReps("8");

    const startTime = getFormattedTime();

    expect(screen.getByText(`Started: ${startTime}`)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500000);
    });

    clickOpenModalTrigger(1);

    submitReps("6");

    expect(screen.getByText(`Started: ${startTime}`)).toBeInTheDocument();
  });

  it("saves and renders finish time after completing the last exercise", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(2);
    submitReps("8");
    clickOpenModalTrigger(2);
    submitReps("7");
    clickOpenModalTrigger(2);
    submitReps("8");

    expect(
      screen.getByText(`Finished: ${getFormattedTime()}`),
    ).toBeInTheDocument();
  });

  it("shows comments when they are turned on", async () => {
    nock.cleanAll();

    nock(nockBaseUrl)
      .get(userExercises.path)
      .reply(userExercises.success.status, userExercises.success.response)
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, {
        showCompletedExercises: false,
        showComments: false,
        showMedia: false,
      })
      .post(saveUserSettings.path)
      .reply(saveUserSettings.success.status, {
        showCompletedExercises: true,
        showComments: true,
        showMedia: true,
      });

    await renderExerciseTracker();

    expect(
      screen.queryByText("Do as many reps as you want"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Elbows should stay straight"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        "Work up to 3 sets of 1 minute holds for this progression",
      ),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Open Menu"));
    fireEvent.click(screen.getByLabelText("Show comments is off"));

    await waitFor(() => {
      expect(
        screen.getByText("Do as many reps as you want"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Elbows should stay straight")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Work up to 3 sets of 1 minute holds for this progression",
      ),
    ).toBeInTheDocument();
  });

  it("does not start the timer after the last exercise and last rep is done", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(2);
    submitReps("8");
    clickOpenModalTrigger(2);
    submitReps("7");
    clickOpenModalTrigger(2);
    submitReps("6");

    act(() => {
      vi.advanceTimersByTime(50000);
    });

    expect(screen.getByText("00:00:00")).toBeInTheDocument();
  });

  it("plays alerts when rest times pass", async () => {
    await renderExerciseTracker();

    clickOpenModalTrigger(1);

    submitReps("6");

    act(() => {
      vi.advanceTimersByTime(190000);
    });

    expect(mockPlay).toHaveBeenCalledTimes(2);
  });

  it("displays spinner while loading", async () => {
    render(<ExerciseTracker />, { wrapper });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("displays a message when there are no exercises", async () => {
    nock.cleanAll();

    nock(nockBaseUrl)
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, getUserSettings.success.response)
      .get(userExercises.path)
      .reply(
        userExercises.noExercises.status,
        userExercises.noExercises.response,
      );

    await renderExerciseTracker();

    expect(screen.getByText("No exercises.")).toBeInTheDocument();
  });

  it("navigates to the settings page when clicking settings in the side menu", async () => {
    await renderExerciseTracker();

    fireEvent.click(screen.getByLabelText("Open Menu"));
    fireEvent.click(screen.getByLabelText("Settings Page"));

    expect(mockPush).toHaveBeenCalledExactlyOnceWith("/settings");
  });

  it("navigates to the home page when clicking home in the side menu", async () => {
    await renderExerciseTracker();

    fireEvent.click(screen.getByLabelText("Open Menu"));
    fireEvent.click(screen.getByLabelText("Home Page"));

    expect(mockPush).toHaveBeenCalledExactlyOnceWith("/");
  });

  it("redirects to sign-in if the api response is 401", async () => {
    nock.cleanAll();

    nock(nockBaseUrl)
      .get(userExercises.path)
      .reply(
        userExercises.unauthorised.status,
        userExercises.unauthorised.response,
      )
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, getUserSettings.success.response);

    await renderExerciseTracker();

    expect(mockPush).toHaveBeenCalledWith("/sign-in");
  });

  it("does not call the api if the flag is off", async () => {
    process.env.NEXT_PUBLIC_ENABLE_API_CONNECTION = "false";

    nock.cleanAll();

    nock(nockBaseUrl)
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, getUserSettings.success.response)
      .get(userExercises.path)
      .reply(userExercises.success.status, [
        {
          id: 2,
          exercise: {
            id: 2,
            key: "fake-exercise",
            name: "Fake Exercise",
            category: "FIRST_PAIR",
            type: "PULL_UP",
            targetSets: 3,
            targetRepsMin: 5,
            targetRepsMax: 8,
            duration: false,
            targetRest: 90,
            additionalRest: 90,
            mediaLink: "",
            comments: "",
          },
        },
      ]);

    await renderExerciseTracker();

    expect(screen.queryByText("Fake Exercise")).not.toBeInTheDocument();
  });

  it("displays an error if the exercises failed to load", async () => {
    nock.cleanAll();

    nock(nockBaseUrl)
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, getUserSettings.success.response)
      .get(userExercises.path)
      .reply(
        userExercises.internalServerError.status,
        userExercises.internalServerError.response,
      );

    await render(<ExerciseTracker />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText("Unexpected end of JSON input"),
      ).toBeInTheDocument();
    });
  });

  it("gets and saves user settings", async () => {
    nock.cleanAll();

    nock(nockBaseUrl)
      .get(getUserSettings.path)
      .reply(getUserSettings.success.status, getUserSettings.success.response)
      .post(saveUserSettings.path)
      .reply(
        saveUserSettings.success.status,
        saveUserSettings.success.response,
      );

    await renderExerciseTracker();

    fireEvent.click(screen.getByLabelText("Open Menu"));

    await waitFor(() => {
      expect(
        screen.getByLabelText("Show completed exercises is on"),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Show comments is on")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Show media is on")).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText("Show completed exercises is on"));
      fireEvent.click(screen.getByLabelText("Show comments is on"));
      fireEvent.click(screen.getByLabelText("Show media is on"));
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText("Show completed exercises is off"),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Show comments is off")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Show media is off")).toBeInTheDocument();
    });
  });

  it("starts a new exercise session when the button is clicked", async () => {
    nock(nockBaseUrl)
      .post(startNewExerciseSession.path)
      .reply(
        startNewExerciseSession.success.status,
        startNewExerciseSession.success.response,
      );

    await renderExerciseTracker();

    fireEvent.click(screen.getByLabelText("Open Menu"));
    fireEvent.click(screen.getByText("New Session"));
    expect(screen.getByText("2025-11-26")).toBeInTheDocument();
  });
});
