package io.ilaro.booking.dto;

import java.math.BigDecimal;

public record ServiceResponse(
        Long id,
        String name,
        int timeInMinutes,
        BigDecimal basePrice
) {}
