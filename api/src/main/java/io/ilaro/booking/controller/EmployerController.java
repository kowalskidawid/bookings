package io.ilaro.booking.controller;

import io.ilaro.booking.dto.EmployerRequest;
import io.ilaro.booking.dto.EmployerResponse;
import io.ilaro.booking.filter.EmployerFilter;
import io.ilaro.booking.service.EmployerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;

    @GetMapping
    public Page<EmployerResponse> findAll(EmployerFilter filter, @PageableDefault(size = 20) Pageable pageable) {
        return employerService.findAll(filter, pageable);
    }

    @GetMapping("/{id}")
    public EmployerResponse findById(@PathVariable Long id) {
        return employerService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployerResponse create(@RequestBody @Valid EmployerRequest request) {
        return employerService.create(request);
    }

    @PutMapping("/{id}")
    public EmployerResponse update(@PathVariable Long id, @RequestBody @Valid EmployerRequest request) {
        return employerService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        employerService.delete(id);
    }
}
