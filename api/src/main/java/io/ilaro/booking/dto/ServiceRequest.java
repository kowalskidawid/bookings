package io.ilaro.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ServiceRequest(
        @NotBlank String name,
        @Min(1) int timeInMinutes
) {}
