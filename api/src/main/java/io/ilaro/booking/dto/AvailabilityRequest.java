package io.ilaro.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record AvailabilityRequest(
        @NotBlank String dayOfWeek,
        @NotNull LocalTime startAt,
        @NotNull LocalTime endAt
) {}
