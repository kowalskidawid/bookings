package io.ilaro.booking.specification;

import io.ilaro.booking.filter.UserFilter;
import io.ilaro.booking.model.User;
import io.ilaro.booking.types.UserType;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

    private UserSpecification() {}

    public static Specification<User> fromFilter(UserFilter filter) {
        return Specification
                .where(likeIgnoreCase("email", filter.getEmail()))
                .and(likeIgnoreCase("firstName", filter.getFirstName()))
                .and(likeIgnoreCase("lastName", filter.getLastName()))
                .and(likeIgnoreCase("phoneNumber", filter.getPhoneNumber()))
                .and(hasUserType(filter.getUserType()));
    }

    private static Specification<User> likeIgnoreCase(String field, String value) {
        return (root, query, cb) -> {
            if (value == null || value.isBlank()) return null;
            return cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%");
        };
    }

    private static Specification<User> hasUserType(UserType userType) {
        return (root, query, cb) -> userType == null ? null : cb.equal(root.get("userType"), userType);
    }
}
