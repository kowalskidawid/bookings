package io.ilaro.booking.specification;

import io.ilaro.booking.filter.ServiceFilter;
import io.ilaro.booking.model.Service;
import org.springframework.data.jpa.domain.Specification;

public class ServiceSpecification {

    private ServiceSpecification() {}

    public static Specification<Service> fromFilter(ServiceFilter filter) {
        return Specification
                .where(likeIgnoreCase("name", filter.getName()))
                .and(timeAtLeast(filter.getTimeInMinutesMin()))
                .and(timeAtMost(filter.getTimeInMinutesMax()));
    }

    private static Specification<Service> likeIgnoreCase(String field, String value) {
        return (root, query, cb) -> {
            if (value == null || value.isBlank()) return null;
            return cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%");
        };
    }

    private static Specification<Service> timeAtLeast(Integer min) {
        return (root, query, cb) -> min == null ? null : cb.greaterThanOrEqualTo(root.get("timeInMinutes"), min);
    }

    private static Specification<Service> timeAtMost(Integer max) {
        return (root, query, cb) -> max == null ? null : cb.lessThanOrEqualTo(root.get("timeInMinutes"), max);
    }
}
