package io.ilaro.booking.dto;

import io.ilaro.booking.types.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Set;

public record AppointmentRequest(
        @NotNull Long clientId,
        @NotNull Long employerId,
        Set<Long> serviceIds,
        @NotNull LocalDateTime startAt,
        @NotNull LocalDateTime endAt,
        AppointmentStatus status
) {}
