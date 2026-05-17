package io.ilaro.booking.filter;

import lombok.Data;

@Data
public class EmployerFilter {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Long serviceId;
    private Long availabilityId;
}
