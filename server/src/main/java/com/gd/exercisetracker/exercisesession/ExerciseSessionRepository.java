package com.gd.exercisetracker.exercisesession;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseSessionRepository extends JpaRepository<ExerciseSession, Long> {
}