package io.ilaro.booking.dto;

public record UserRequest(
    String email,
    String firstName,
    String password,
    String lastName,
    String phoneNumber
) {}
