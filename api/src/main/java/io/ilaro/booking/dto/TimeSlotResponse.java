package io.ilaro.booking.dto;

import java.time.LocalDateTime;

public record TimeSlotResponse(
        LocalDateTime startAt,
        LocalDateTime endAt
) {}
