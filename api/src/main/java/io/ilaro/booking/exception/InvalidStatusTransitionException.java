package io.ilaro.booking.exception;

/**
 * Sygnalizuje próbę niedozwolonej zmiany statusu wizyty względem maszyny stanów (WF4).
 */
public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(String message) {
        super(message);
    }
}
