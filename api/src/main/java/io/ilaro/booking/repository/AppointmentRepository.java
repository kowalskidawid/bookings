package io.ilaro.booking.repository;

import io.ilaro.booking.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long>, JpaSpecificationExecutor<Appointment> {

    @Query("SELECT a FROM Appointment a WHERE a.employer.id = :employerId AND a.startAt >= :from AND a.startAt < :to")
    List<Appointment> findByEmployerAndDateRange(
            @Param("employerId") Long employerId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
