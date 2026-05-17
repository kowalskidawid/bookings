package io.ilaro.booking.service;

import io.ilaro.booking.dto.AvailabilityRequest;
import io.ilaro.booking.dto.AvailabilityResponse;
import io.ilaro.booking.exception.ResourceNotFoundException;
import io.ilaro.booking.filter.AvailabilityFilter;
import io.ilaro.booking.mapper.AvailabilityMapper;
import io.ilaro.booking.model.Availability;
import io.ilaro.booking.repository.AvailabilityRepository;
import io.ilaro.booking.specification.AvailabilitySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final AvailabilityMapper availabilityMapper;

    public Page<AvailabilityResponse> findAll(AvailabilityFilter filter, Pageable pageable) {
        return availabilityRepository.findAll(AvailabilitySpecification.fromFilter(filter), pageable)
                .map(availabilityMapper::toResponse);
    }

    public AvailabilityResponse findById(Long id) {
        return availabilityRepository.findById(id)
                .map(availabilityMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found: " + id));
    }

    @Transactional
    public AvailabilityResponse create(AvailabilityRequest request) {
        Availability availability = availabilityMapper.toEntity(request);
        return availabilityMapper.toResponse(availabilityRepository.save(availability));
    }

    @Transactional
    public AvailabilityResponse update(Long id, AvailabilityRequest request) {
        Availability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found: " + id));
        availabilityMapper.updateEntity(request, availability);
        return availabilityMapper.toResponse(availabilityRepository.save(availability));
    }

    @Transactional
    public void delete(Long id) {
        if (!availabilityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Availability not found: " + id);
        }
        availabilityRepository.deleteById(id);
    }
}
