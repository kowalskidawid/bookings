package io.ilaro.booking.specification;

import io.ilaro.booking.filter.AvailabilityFilter;
import io.ilaro.booking.model.Availability;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalTime;

public class AvailabilitySpecification {

    private AvailabilitySpecification() {}

    public static Specification<Availability> fromFilter(AvailabilityFilter filter) {
        return Specification
                .where(hasDayOfWeek(filter.getDayOfWeek()))
                .and(startAtFrom(filter.getStartAtFrom()))
                .and(startAtTo(filter.getStartAtTo()))
                .and(endAtFrom(filter.getEndAtFrom()))
                .and(endAtTo(filter.getEndAtTo()));
    }

    private static Specification<Availability> hasDayOfWeek(String dayOfWeek) {
        return (root, query, cb) -> {
            if (dayOfWeek == null || dayOfWeek.isBlank()) return null;
            return cb.equal(cb.lower(root.get("dayOfWeek")), dayOfWeek.toLowerCase());
        };
    }

    private static Specification<Availability> startAtFrom(LocalTime from) {
        return (root, query, cb) -> from == null ? null : cb.greaterThanOrEqualTo(root.get("startAt"), from);
    }

    private static Specification<Availability> startAtTo(LocalTime to) {
        return (root, query, cb) -> to == null ? null : cb.lessThanOrEqualTo(root.get("startAt"), to);
    }

    private static Specification<Availability> endAtFrom(LocalTime from) {
        return (root, query, cb) -> from == null ? null : cb.greaterThanOrEqualTo(root.get("endAt"), from);
    }

    private static Specification<Availability> endAtTo(LocalTime to) {
        return (root, query, cb) -> to == null ? null : cb.lessThanOrEqualTo(root.get("endAt"), to);
    }
}
