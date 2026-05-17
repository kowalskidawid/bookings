package io.ilaro.booking.filter;

import lombok.Data;

import java.time.LocalTime;

@Data
public class AvailabilityFilter {
    private String dayOfWeek;
    private LocalTime startAtFrom;
    private LocalTime startAtTo;
    private LocalTime endAtFrom;
    private LocalTime endAtTo;
}
