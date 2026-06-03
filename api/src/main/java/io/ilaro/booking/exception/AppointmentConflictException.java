package io.ilaro.booking.exception;

/**
 * Sygnalizuje, że wizyty nie można zapisać, ponieważ jej termin koliduje z inną
 * wizytą danego pracownika lub wykracza poza jego godziny pracy (WF3).
 */
public class AppointmentConflictException extends RuntimeException {
    public AppointmentConflictException(String message) {
        super(message);
    }
}
