package io.ilaro.booking.service;

import io.ilaro.booking.exception.AppointmentConflictException;
import io.ilaro.booking.model.Appointment;
import io.ilaro.booking.model.Availability;
import io.ilaro.booking.model.Employer;
import io.ilaro.booking.repository.AppointmentRepository;
import io.ilaro.booking.types.AppointmentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Realizuje kluczową regułę biznesową WF3 – walidację dostępności terminu wizyty.
 * <p>
 * Zapis wizyty jest odrzucany ({@link AppointmentConflictException}), jeżeli wyznaczony
 * przedział czasowy:
 * <ul>
 *     <li>jest niepoprawny (zakończenie nie jest późniejsze niż rozpoczęcie),</li>
 *     <li>wykracza poza zdefiniowane godziny pracy pracownika w danym dniu tygodnia,</li>
 *     <li>koliduje z inną, już zaplanowaną (nieanulowaną) wizytą tego pracownika.</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
public class AppointmentValidator {

    private final AppointmentRepository appointmentRepository;

    /**
     * Waliduje termin wizyty dla danego pracownika.
     *
     * @param employer             pracownik realizujący wizytę (wraz z jego dostępnościami)
     * @param startAt              początek wizyty
     * @param endAt                koniec wizyty
     * @param excludeAppointmentId identyfikator wizyty pomijanej przy wykrywaniu kolizji
     *                             (przy aktualizacji istniejącej wizyty), może być {@code null}
     */
    public void validate(Employer employer, LocalDateTime startAt, LocalDateTime endAt, Long excludeAppointmentId) {
        if (startAt == null || endAt == null || !endAt.isAfter(startAt)) {
            throw new AppointmentConflictException(
                    "Czas zakończenia wizyty musi być późniejszy niż czas rozpoczęcia.");
        }
        validateWithinWorkingHours(employer, startAt, endAt);
        validateNoOverlap(employer, startAt, endAt, excludeAppointmentId);
    }

    private void validateWithinWorkingHours(Employer employer, LocalDateTime startAt, LocalDateTime endAt) {
        String dayOfWeek = startAt.getDayOfWeek().name();
        LocalDate date = startAt.toLocalDate();

        List<Availability> dayAvailabilities = employer.getAvailabilities() == null
                ? List.of()
                : employer.getAvailabilities().stream()
                .filter(a -> a.getDayOfWeek() != null && a.getDayOfWeek().equalsIgnoreCase(dayOfWeek))
                .toList();

        if (dayAvailabilities.isEmpty()) {
            throw new AppointmentConflictException("Pracownik nie pracuje w wybranym dniu tygodnia.");
        }

        boolean fitsInWorkingWindow = dayAvailabilities.stream().anyMatch(a -> {
            LocalDateTime windowStart = date.atTime(a.getStartAt());
            LocalDateTime windowEnd = date.atTime(a.getEndAt());
            return !startAt.isBefore(windowStart) && !endAt.isAfter(windowEnd);
        });

        if (!fitsInWorkingWindow) {
            throw new AppointmentConflictException(
                    "Termin wizyty wykracza poza godziny pracy pracownika.");
        }
    }

    private void validateNoOverlap(Employer employer, LocalDateTime startAt, LocalDateTime endAt, Long excludeAppointmentId) {
        LocalDate date = startAt.toLocalDate();
        List<Appointment> existing = appointmentRepository.findByEmployerAndDateRange(
                employer.getId(), date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        boolean conflict = existing.stream()
                .filter(a -> excludeAppointmentId == null || !a.getId().equals(excludeAppointmentId))
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELED)
                .anyMatch(a -> a.getStartAt().isBefore(endAt) && a.getEndAt().isAfter(startAt));

        if (conflict) {
            throw new AppointmentConflictException(
                    "Termin koliduje z inną zaplanowaną wizytą tego pracownika.");
        }
    }
}
