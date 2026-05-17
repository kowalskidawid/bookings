package io.ilaro.booking.controller;

import io.ilaro.booking.dto.AvailabilityRequest;
import io.ilaro.booking.dto.AvailabilityResponse;
import io.ilaro.booking.filter.AvailabilityFilter;
import io.ilaro.booking.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/availabilities")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping
    public Page<AvailabilityResponse> findAll(AvailabilityFilter filter, @PageableDefault(size = 20) Pageable pageable) {
        return availabilityService.findAll(filter, pageable);
    }

    @GetMapping("/{id}")
    public AvailabilityResponse findById(@PathVariable Long id) {
        return availabilityService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AvailabilityResponse create(@RequestBody @Valid AvailabilityRequest request) {
        return availabilityService.create(request);
    }

    @PutMapping("/{id}")
    public AvailabilityResponse update(@PathVariable Long id, @RequestBody @Valid AvailabilityRequest request) {
        return availabilityService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        availabilityService.delete(id);
    }
}
