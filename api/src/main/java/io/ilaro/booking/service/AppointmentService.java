package io.ilaro.booking.service;

import io.ilaro.booking.dto.AppointmentRequest;
import io.ilaro.booking.dto.AppointmentResponse;
import io.ilaro.booking.exception.ResourceNotFoundException;
import io.ilaro.booking.filter.AppointmentFilter;
import io.ilaro.booking.mapper.AppointmentMapper;
import io.ilaro.booking.model.Appointment;
import io.ilaro.booking.model.Service;
import io.ilaro.booking.model.User;
import io.ilaro.booking.repository.AppointmentRepository;
import io.ilaro.booking.repository.ServiceRepository;
import io.ilaro.booking.repository.UserRepository;
import io.ilaro.booking.specification.AppointmentSpecification;
import io.ilaro.booking.types.AppointmentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final AppointmentMapper appointmentMapper;
    private final EmailService emailService;

    public Page<AppointmentResponse> findAll(AppointmentFilter filter, Pageable pageable) {
        return appointmentRepository.findAll(AppointmentSpecification.fromFilter(filter), pageable)
                .map(appointmentMapper::toResponse);
    }

    public AppointmentResponse findById(Long id) {
        return appointmentRepository.findById(id)
                .map(appointmentMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request) {
        Appointment appointment = appointmentMapper.toEntity(request);
        appointment.setReadableId(generateReadableId());
        appointment.setClient(resolveUser(request.clientId()));
        appointment.setEmployer(resolveUser(request.employerId()));
        appointment.setServices(resolveServices(request.serviceIds()));
        appointment.setStatus(AppointmentStatus.BOOKED);

        AppointmentResponse response = appointmentMapper.toResponse(appointmentRepository.save(appointment));
        emailService.sendBookingConfirmation(response);
        return response;
    }

    @Transactional
    public AppointmentResponse update(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
        appointmentMapper.updateEntity(request, appointment);
        appointment.setClient(resolveUser(request.clientId()));
        appointment.setEmployer(resolveUser(request.employerId()));
        appointment.setServices(resolveServices(request.serviceIds()));
        if (request.status() != null) {
            appointment.setStatus(request.status());
        }
        AppointmentResponse response = appointmentMapper.toResponse(appointmentRepository.save(appointment));
        emailService.sendAppointmentUpdated(response);
        return response;
    }

    @Transactional
    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    private User resolveUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    private Set<Service> resolveServices(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return Collections.emptySet();
        return ids.stream()
                .map(sid -> serviceRepository.findById(sid)
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + sid)))
                .collect(Collectors.toSet());
    }

    private String generateReadableId() {

        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));

        SecureRandom random = new SecureRandom();
        int randomPart = random.nextInt(900000) + 100000;

        return datePart + randomPart;
    }
}
