package io.ilaro.booking.specification;

import io.ilaro.booking.filter.EmployerFilter;
import io.ilaro.booking.model.Employer;
import org.springframework.data.jpa.domain.Specification;

public class EmployerSpecification {

    private EmployerSpecification() {}

    public static Specification<Employer> fromFilter(EmployerFilter filter) {
        return Specification
                .where(likeIgnoreCase("email", filter.getEmail()))
                .and(likeIgnoreCase("firstName", filter.getFirstName()))
                .and(likeIgnoreCase("lastName", filter.getLastName()))
                .and(likeIgnoreCase("phoneNumber", filter.getPhoneNumber()))
                .and(hasService(filter.getServiceId()))
                .and(hasAvailability(filter.getAvailabilityId()));
    }

    private static Specification<Employer> likeIgnoreCase(String field, String value) {
        return (root, query, cb) -> {
            if (value == null || value.isBlank()) return null;
            return cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%");
        };
    }

    private static Specification<Employer> hasService(Long serviceId) {
        return (root, query, cb) -> {
            if (serviceId == null) return null;
            return cb.equal(root.join("services").get("id"), serviceId);
        };
    }

    private static Specification<Employer> hasAvailability(Long availabilityId) {
        return (root, query, cb) -> {
            if (availabilityId == null) return null;
            return cb.equal(root.join("availabilities").get("id"), availabilityId);
        };
    }
}
