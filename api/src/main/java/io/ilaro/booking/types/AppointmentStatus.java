package io.ilaro.booking.types;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum AppointmentStatus {
    BOOKED, CONFIRMED, FINISHED, CANCELED, NO_SHOW;

    private static final Map<AppointmentStatus, Set<AppointmentStatus>> ALLOWED_TRANSITIONS = Map.of(
            BOOKED, EnumSet.of(CONFIRMED, FINISHED, CANCELED, NO_SHOW),
            CONFIRMED, EnumSet.of(FINISHED, CANCELED, NO_SHOW),
            FINISHED, EnumSet.noneOf(AppointmentStatus.class),
            CANCELED, EnumSet.noneOf(AppointmentStatus.class),
            NO_SHOW, EnumSet.noneOf(AppointmentStatus.class)
    );

    public boolean canTransitionTo(AppointmentStatus target) {
        if (target == null || target == this) return true;
        return ALLOWED_TRANSITIONS.getOrDefault(this, Set.of()).contains(target);
    }
}
