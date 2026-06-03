package io.ilaro.booking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ServiceRequest(
        @NotBlank String name,
        @Min(1) int timeInMinutes,
        @NotNull @DecimalMin("0.0") BigDecimal basePrice
) {}
