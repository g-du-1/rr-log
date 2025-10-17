package com.gd.exercisetracker.exercisesession;

import org.springframework.stereotype.Service;

@Service
public class ExerciseSessionService {
    private final ExerciseSessionRepository exerciseSessionRepository;

    public ExerciseSessionService(ExerciseSessionRepository exerciseSessionRepository) {
        this.exerciseSessionRepository = exerciseSessionRepository;
    }

    public ExerciseSession start() {
        ExerciseSession exerciseSession = new ExerciseSession();

        return exerciseSessionRepository.save(exerciseSession);
    }
}
