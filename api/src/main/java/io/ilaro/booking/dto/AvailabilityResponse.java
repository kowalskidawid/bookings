package io.ilaro.booking.dto;

import java.time.LocalTime;

public record AvailabilityResponse(
        Long id,
        String dayOfWeek,
        LocalTime startAt,
        LocalTime endAt
) {}
