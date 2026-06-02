package io.ilaro.booking.service;

import io.ilaro.booking.dto.*;
import io.ilaro.booking.exception.ResourceNotFoundException;
import io.ilaro.booking.mapper.AppointmentMapper;
import io.ilaro.booking.mapper.EmployerMapper;
import io.ilaro.booking.mapper.ServiceMapper;
import io.ilaro.booking.model.*;
import io.ilaro.booking.repository.*;
import io.ilaro.booking.types.AppointmentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicBookingService {

    private final ServiceRepository serviceRepository;
    private final EmployerRepository employerRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AppointmentMapper appointmentMapper;
    private final EmployerMapper employerMapper;
    private final ServiceMapper serviceMapper;
    private final EmailService emailService;

    public List<ServiceResponse> getServices() {
        return serviceRepository.findAll().stream()
                .map(serviceMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<EmployerResponse> getEmployersByService(Long serviceId) {
        return employerRepository.findAll().stream()
                .filter(e -> e.getServices().stream().anyMatch(s -> s.getId().equals(serviceId)))
                .map(employerMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<TimeSlotResponse> getAvailableSlots(Long employerId, Long serviceId, LocalDate date) {
        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found: " + employerId));

        io.ilaro.booking.model.Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + serviceId));

        String dayOfWeek = date.getDayOfWeek().name();

        List<Availability> dayAvailabilities = employer.getAvailabilities().stream()
                .filter(a -> a.getDayOfWeek().equals(dayOfWeek))
                .collect(Collectors.toList());

        if (dayAvailabilities.isEmpty()) return Collections.emptyList();

        List<Appointment> existing = appointmentRepository.findByEmployerAndDateRange(
                employerId, date.atStartOfDay(), date.plusDays(1).atStartOfDay()
        );

        int duration = service.getTimeInMinutes();
        LocalDateTime now = LocalDateTime.now();
        List<TimeSlotResponse> slots = new ArrayList<>();

        for (Availability avail : dayAvailabilities) {
            LocalDateTime current = date.atTime(avail.getStartAt());
            LocalDateTime windowEnd = date.atTime(avail.getEndAt());

            while (!current.plusMinutes(duration).isAfter(windowEnd)) {
                final LocalDateTime slotStart = current;
                LocalDateTime slotEnd = slotStart.plusMinutes(duration);

                boolean isPast = !slotStart.isAfter(now);

                boolean hasConflict = existing.stream().anyMatch(appt ->
                        appt.getStatus() != AppointmentStatus.CANCELED
                                && appt.getStartAt().isBefore(slotEnd) && appt.getEndAt().isAfter(slotStart)
                );

                if (!isPast && !hasConflict) {
                    slots.add(new TimeSlotResponse(slotStart, slotEnd));
                }
                current = slotEnd;
            }
        }

        return slots;
    }

    @Transactional
    public AppointmentResponse book(PublicBookingRequest request) {
        User customer = userRepository.findByEmail(request.email()).orElseGet(() -> {
            User u = new User();
            u.setEmail(request.email());
            u.setFirstName(request.firstName());
            u.setLastName(request.lastName());
            u.setPhoneNumber(request.phoneNumber());
            return userRepository.save(u);
        });

        User employer = userRepository.findById(request.employerId())
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found: " + request.employerId()));

        io.ilaro.booking.model.Service service = serviceRepository.findById(request.serviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + request.serviceId()));

        Appointment appointment = new Appointment();
        appointment.setReadableId(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        appointment.setClient(customer);
        appointment.setEmployer(employer);
        appointment.setServices(Set.of(service));
        appointment.setStartAt(request.startAt());
        appointment.setEndAt(request.startAt().plusMinutes(service.getTimeInMinutes()));
        appointment.setStatus(AppointmentStatus.BOOKED);

        AppointmentResponse response = appointmentMapper.toResponse(appointmentRepository.save(appointment));
        emailService.sendBookingConfirmation(response);
        return response;
    }
}
