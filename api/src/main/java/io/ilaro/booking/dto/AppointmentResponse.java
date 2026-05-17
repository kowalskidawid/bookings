package io.ilaro.booking.dto;

import io.ilaro.booking.types.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.Set;

public record AppointmentResponse(
        Long id,
        String readableId,
        UserResponse client,
        UserResponse employer,
        Set<ServiceResponse> services,
        LocalDateTime startAt,
        LocalDateTime endAt,
        AppointmentStatus status
) {}
