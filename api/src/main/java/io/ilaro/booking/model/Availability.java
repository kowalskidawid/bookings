package io.ilaro.booking.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "availabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dayOfWeek;
    private LocalTime startAt;
    private LocalTime endAt;
}
