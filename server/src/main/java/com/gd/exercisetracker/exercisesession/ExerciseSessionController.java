package com.gd.exercisetracker.exercisesession;

import com.gd.exercisetracker.exercisesession.dto.ExerciseSessionDto;
import com.gd.exercisetracker.security.user.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/exercise-session")
public class ExerciseSessionController {
    private final ExerciseSessionService exerciseSessionService;

    public ExerciseSessionController(ExerciseSessionService exerciseSessionService) {
        this.exerciseSessionService = exerciseSessionService;
    }

    @PostMapping
    public ResponseEntity<ExerciseSessionDto> startNew(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Long userId = userDetails.getId();

        return ResponseEntity.ok(exerciseSessionService.startNew(userId));
    }
}