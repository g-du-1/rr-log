package com.gd.exercisetracker.exercisesession;

import com.gd.exercisetracker.exercisesession.dto.ExerciseSessionDto;
import com.gd.exercisetracker.exercisesession.dto.ExerciseSessionMapper;
import com.gd.exercisetracker.security.user.User;
import org.springframework.stereotype.Service;

@Service
public class ExerciseSessionService {
    private final ExerciseSessionRepository exerciseSessionRepository;

    public ExerciseSessionService(ExerciseSessionRepository exerciseSessionRepository) {
        this.exerciseSessionRepository = exerciseSessionRepository;
    }

    public ExerciseSessionDto startNew(Long userId) {
        ExerciseSession newSession = new ExerciseSession();
        User user = new User();
        user.setUserId(userId);
        newSession.setUser(user);
        ExerciseSession savedSession = exerciseSessionRepository.save(newSession);
        return ExerciseSessionMapper.INSTANCE.exerciseSessionToExerciseSessionDto(savedSession);
    }
}