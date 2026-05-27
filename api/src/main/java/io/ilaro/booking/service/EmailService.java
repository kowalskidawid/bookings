package io.ilaro.booking.service;

import io.ilaro.booking.dto.AppointmentResponse;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${mail.from:noreply@booking.local}")
    private String from;

    @Value("${mail.from-name:Booking}")
    private String fromName;

    @Async
    public void sendBookingConfirmation(AppointmentResponse appointment) {
        String to = appointment.client().email();
        if (to == null || to.isBlank()) return;

        Context ctx = new Context();
        ctx.setVariable("appointment", appointment);
        String html = templateEngine.process("email/booking-confirmation", ctx);

        send(to, "Potwierdzenie przyjęcia rezerwacji – " + appointment.readableId(), html);
    }
    public void sendWelcomeEmail(String userEmail, String tempPassword) {
        Context context = new Context();
        context.setVariable("email", userEmail);
        context.setVariable("password", tempPassword);

        String htmlContent = templateEngine.process("email/welcome-email", context);

        send(userEmail, "Witamy w Bookings! Twoje tymczasowe hasło", htmlContent);
    }

    @Async
    public void sendAppointmentUpdated(AppointmentResponse appointment) {
        String to = appointment.client().email();
        if (to == null || to.isBlank()) return;

        Context ctx = new Context();
        ctx.setVariable("appointment", appointment);
        String html = templateEngine.process("email/appointment-updated", ctx);

        send(to, "Aktualizacja wizyty – " + appointment.readableId(), html);
    }

    private void send(String to, String subject, String html) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(from, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(msg);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Nie udało się wysłać maila do {}: {}", to, e.getMessage());
        }


    }
}
