package io.ilaro.booking.controller;

import io.ilaro.booking.dto.ServiceRequest;
import io.ilaro.booking.dto.ServiceResponse;
import io.ilaro.booking.filter.ServiceFilter;
import io.ilaro.booking.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping
    public Page<ServiceResponse> findAll(ServiceFilter filter, @PageableDefault(size = 20) Pageable pageable) {
        return serviceService.findAll(filter, pageable);
    }

    @GetMapping("/{id}")
    public ServiceResponse findById(@PathVariable Long id) {
        return serviceService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceResponse create(@RequestBody @Valid ServiceRequest request) {
        return serviceService.create(request);
    }

    @PutMapping("/{id}")
    public ServiceResponse update(@PathVariable Long id, @RequestBody @Valid ServiceRequest request) {
        return serviceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        serviceService.delete(id);
    }
}
