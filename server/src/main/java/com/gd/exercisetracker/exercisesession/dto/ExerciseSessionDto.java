package com.gd.exercisetracker.exercisesession.dto;

import java.time.Instant;

public record ExerciseSessionDto (
    boolean active,
    Instant createdAt
) {}
