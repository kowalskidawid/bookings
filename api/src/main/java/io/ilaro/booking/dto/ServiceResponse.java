package io.ilaro.booking.dto;

public record ServiceResponse(
        Long id,
        String name,
        int timeInMinutes
) {}
