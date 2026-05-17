package io.ilaro.booking.filter;

import lombok.Data;

@Data
public class ServiceFilter {
    private String name;
    private Integer timeInMinutesMin;
    private Integer timeInMinutesMax;
}
