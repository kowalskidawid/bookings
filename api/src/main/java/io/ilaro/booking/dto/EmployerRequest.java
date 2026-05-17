package io.ilaro.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record EmployerRequest(
        @NotBlank @Email String email,
        @NotBlank String firstName,
        @NotBlank String lastName,
        String password,
        String phoneNumber,
        Set<Long> serviceIds,
        Set<Long> availabilityIds
) {}
