package io.ilaro.booking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Entity
@Getter
@Setter
public class Employer extends User {
    @ManyToMany
    @JoinTable(
            name = "users_services",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))
    private Set<Service> services;
    @ManyToMany
    @JoinTable(
            name = "users_availabilities",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "availability_id"))
    private Set<Availability> availabilities;

}
