package io.ilaro.booking.dto;

import io.ilaro.booking.types.UserType;

public record UserResponse(
        Long id,
        UserType userType,
        String email,
        String firstName,
        String password,
        String lastName,
        String phoneNumber
) {
}
