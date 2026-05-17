package io.ilaro.booking.filter;

import io.ilaro.booking.types.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentFilter {
    private String readableId;
    private Long clientId;
    private Long employerId;
    private AppointmentStatus status;
    private LocalDateTime startAtFrom;
    private LocalDateTime startAtTo;
}
