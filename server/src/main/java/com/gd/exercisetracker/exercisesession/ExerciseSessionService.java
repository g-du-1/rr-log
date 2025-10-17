package com.gd.exercisetracker.exercisesession;

import com.gd.exercisetracker.exercisesession.dto.UpdateExerciseSessionRequest;
import com.gd.exercisetracker.security.user.User;
import org.springframework.stereotype.Service;

@Service
public class ExerciseSessionService {
    private final ExerciseSessionRepository exerciseSessionRepository;

    public ExerciseSessionService(ExerciseSessionRepository exerciseSessionRepository) {
        this.exerciseSessionRepository = exerciseSessionRepository;
    }

    public ExerciseSession update(Long userId, UpdateExerciseSessionRequest updateExerciseSessionRequest) {
        ExerciseSession session = exerciseSessionRepository.findAll().stream()
                .filter(s -> s.getUser().getUserId().equals(userId) && s.isActive())
                .findFirst()
                .orElseGet(() -> {
                    ExerciseSession newSession = new ExerciseSession();
                    newSession.setActive(true);
                    User user = new User();
                    user.setUserId(userId);
                    newSession.setUser(user);
                    return newSession;
                });

        session.setData(updateExerciseSessionRequest.getData().toString());
        session.setActive(true);

        return exerciseSessionRepository.save(session);
    }

    public ExerciseSession getExerciseSession(Long userId) {
        return exerciseSessionRepository.findAll().stream()
                .filter(s -> s.getUser().getUserId().equals(userId) && s.isActive())
                .findFirst()
                .orElse(null);
    }
}
