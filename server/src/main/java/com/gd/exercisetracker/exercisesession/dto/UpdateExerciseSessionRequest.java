package com.gd.exercisetracker.exercisesession.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

@Data
public class UpdateExerciseSessionRequest {
    private JsonNode data;
}
