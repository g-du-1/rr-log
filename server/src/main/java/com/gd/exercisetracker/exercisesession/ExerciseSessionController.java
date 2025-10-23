package com.gd.exercisetracker.exercisesession;

import com.gd.exercisetracker.exercisesession.dto.UpdateExerciseSessionRequest;
import com.gd.exercisetracker.security.user.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/exercise-session")
public class ExerciseSessionController {
    private final ExerciseSessionService exerciseSessionService;

    public ExerciseSessionController(ExerciseSessionService exerciseSessionService) {
        this.exerciseSessionService = exerciseSessionService;
    }

    @GetMapping
    public ExerciseSession getExerciseSession(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getId();

        return exerciseSessionService.getExerciseSession(userId);
    }

    @PutMapping
    public ExerciseSession update(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody UpdateExerciseSessionRequest updateExerciseSessionRequest) {
        Long userId = userDetails.getId();

        return exerciseSessionService.update(userId, updateExerciseSessionRequest);
    }

    @PostMapping
    public ExerciseSession startNew(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getId();

        return exerciseSessionService.startNew(userId);
    }
}
