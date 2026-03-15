package io.ilaro.booking.repository;

import io.ilaro.booking.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, Long> {
}
