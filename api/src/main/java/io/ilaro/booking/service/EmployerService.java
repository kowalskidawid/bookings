package io.ilaro.booking.service;

import io.ilaro.booking.dto.EmployerRequest;
import io.ilaro.booking.dto.EmployerResponse;
import io.ilaro.booking.exception.ResourceNotFoundException;
import io.ilaro.booking.filter.EmployerFilter;
import io.ilaro.booking.mapper.EmployerMapper;
import io.ilaro.booking.model.Availability;
import io.ilaro.booking.model.Employer;
import io.ilaro.booking.model.Service;
import io.ilaro.booking.repository.AvailabilityRepository;
import io.ilaro.booking.repository.EmployerRepository;
import io.ilaro.booking.repository.ServiceRepository;
import io.ilaro.booking.specification.EmployerSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerRepository employerRepository;
    private final ServiceRepository serviceRepository;
    private final AvailabilityRepository availabilityRepository;
    private final EmployerMapper employerMapper;

    public Page<EmployerResponse> findAll(EmployerFilter filter, Pageable pageable) {
        return employerRepository.findAll(EmployerSpecification.fromFilter(filter), pageable)
                .map(employerMapper::toResponse);
    }

    public EmployerResponse findById(Long id) {
        return employerRepository.findById(id)
                .map(employerMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found: " + id));
    }

    @Transactional
    public EmployerResponse create(EmployerRequest request) {
        Employer employer = employerMapper.toEntity(request);
        employer.setServices(resolveServices(request.serviceIds()));
        employer.setAvailabilities(resolveAvailabilities(request.availabilityIds()));
        return employerMapper.toResponse(employerRepository.save(employer));
    }

    @Transactional
    public EmployerResponse update(Long id, EmployerRequest request) {
        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found: " + id));
        employerMapper.updateEntity(request, employer);
        employer.setServices(resolveServices(request.serviceIds()));
        employer.setAvailabilities(resolveAvailabilities(request.availabilityIds()));
        return employerMapper.toResponse(employerRepository.save(employer));
    }

    @Transactional
    public void delete(Long id) {
        if (!employerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employer not found: " + id);
        }
        try {
            employerRepository.deleteById(id);
            employerRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nie można usunąć pracownika, ponieważ ma przypisane aktywne wizyty."
            );
    }}

    private Set<Service> resolveServices(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return Collections.emptySet();
        return ids.stream()
                .map(sid -> serviceRepository.findById(sid)
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + sid)))
                .collect(Collectors.toSet());
    }

    private Set<Availability> resolveAvailabilities(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return Collections.emptySet();
        return ids.stream()
                .map(aid -> availabilityRepository.findById(aid)
                        .orElseThrow(() -> new ResourceNotFoundException("Availability not found: " + aid)))
                .collect(Collectors.toSet());
    }
}
