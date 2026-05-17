package io.ilaro.booking.specification;

import io.ilaro.booking.filter.AppointmentFilter;
import io.ilaro.booking.model.Appointment;
import io.ilaro.booking.types.AppointmentStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class AppointmentSpecification {

    private AppointmentSpecification() {}

    public static Specification<Appointment> fromFilter(AppointmentFilter filter) {
        return Specification
                .where(hasReadableId(filter.getReadableId()))
                .and(hasClient(filter.getClientId()))
                .and(hasEmployer(filter.getEmployerId()))
                .and(hasStatus(filter.getStatus()))
                .and(startAtFrom(filter.getStartAtFrom()))
                .and(startAtTo(filter.getStartAtTo()));
    }

    private static Specification<Appointment> hasReadableId(String readableId) {
        return (root, query, cb) -> {
            if (readableId == null || readableId.isBlank()) return null;
            return cb.equal(root.get("readableId"), readableId);
        };
    }

    private static Specification<Appointment> hasClient(Long clientId) {
        return (root, query, cb) -> clientId == null ? null : cb.equal(root.get("client").get("id"), clientId);
    }

    private static Specification<Appointment> hasEmployer(Long employerId) {
        return (root, query, cb) -> employerId == null ? null : cb.equal(root.get("employer").get("id"), employerId);
    }

    private static Specification<Appointment> hasStatus(AppointmentStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    private static Specification<Appointment> startAtFrom(LocalDateTime from) {
        return (root, query, cb) -> from == null ? null : cb.greaterThanOrEqualTo(root.get("startAt"), from);
    }

    private static Specification<Appointment> startAtTo(LocalDateTime to) {
        return (root, query, cb) -> to == null ? null : cb.lessThanOrEqualTo(root.get("startAt"), to);
    }
}
