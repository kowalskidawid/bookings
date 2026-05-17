package io.ilaro.booking.filter;

import io.ilaro.booking.types.UserType;
import lombok.Data;

@Data
public class UserFilter {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private UserType userType;
}
