package io.ilaro.booking.model;

import io.ilaro.booking.types.AppointmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String readableId;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;
    @ManyToOne
    @JoinColumn(name = "employer_id")
    private User employer;
    @ManyToMany
    @JoinTable(
            name = "appointments_services",
            joinColumns = @JoinColumn(name = "appointment_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))
    private Set<Service> services;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private AppointmentStatus status;
}
