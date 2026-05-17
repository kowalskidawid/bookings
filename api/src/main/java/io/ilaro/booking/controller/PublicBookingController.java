package io.ilaro.booking.controller;

import io.ilaro.booking.dto.*;
import io.ilaro.booking.service.PublicBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicBookingController {

    private final PublicBookingService publicBookingService;

    @GetMapping("/services")
    public List<ServiceResponse> getServices() {
        return publicBookingService.getServices();
    }

    @GetMapping("/employers")
    public List<EmployerResponse> getEmployers(@RequestParam Long serviceId) {
        return publicBookingService.getEmployersByService(serviceId);
    }

    @GetMapping("/slots")
    public List<TimeSlotResponse> getSlots(
            @RequestParam Long employerId,
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return publicBookingService.getAvailableSlots(employerId, serviceId, date);
    }

    @PostMapping("/book")
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse book(@RequestBody @Valid PublicBookingRequest request) {
        return publicBookingService.book(request);
    }
}
