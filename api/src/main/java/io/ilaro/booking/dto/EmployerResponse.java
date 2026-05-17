package io.ilaro.booking.dto;

import io.ilaro.booking.types.UserType;

import java.util.Set;

public record EmployerResponse(
        Long id,
        UserType userType,
        String email,
        String firstName,
        String lastName,
        String phoneNumber,
        Set<ServiceResponse> services,
        Set<AvailabilityResponse> availabilities
) {}
