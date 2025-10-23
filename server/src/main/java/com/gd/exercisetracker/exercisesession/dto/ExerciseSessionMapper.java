package com.gd.exercisetracker.exercisesession.dto;

import com.gd.exercisetracker.exercisesession.ExerciseSession;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ExerciseSessionMapper {
    ExerciseSessionMapper INSTANCE = Mappers.getMapper(ExerciseSessionMapper.class);
    ExerciseSessionDto exerciseSessionToExerciseSessionDto(ExerciseSession exerciseSession);
}
