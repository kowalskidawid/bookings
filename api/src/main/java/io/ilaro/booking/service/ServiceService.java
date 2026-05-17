package io.ilaro.booking.service;

import io.ilaro.booking.dto.ServiceRequest;
import io.ilaro.booking.dto.ServiceResponse;
import io.ilaro.booking.exception.ResourceNotFoundException;
import io.ilaro.booking.filter.ServiceFilter;
import io.ilaro.booking.mapper.ServiceMapper;
import io.ilaro.booking.model.Service;
import io.ilaro.booking.repository.ServiceRepository;
import io.ilaro.booking.specification.ServiceSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;

    public Page<ServiceResponse> findAll(ServiceFilter filter, Pageable pageable) {
        return serviceRepository.findAll(ServiceSpecification.fromFilter(filter), pageable)
                .map(serviceMapper::toResponse);
    }

    public ServiceResponse findById(Long id) {
        return serviceRepository.findById(id)
                .map(serviceMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + id));
    }

    @Transactional
    public ServiceResponse create(ServiceRequest request) {
        Service service = serviceMapper.toEntity(request);
        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    @Transactional
    public ServiceResponse update(Long id, ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + id));
        serviceMapper.updateEntity(request, service);
        return serviceMapper.toResponse(serviceRepository.save(service));
    }

    @Transactional
    public void delete(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Service not found: " + id);
        }
        serviceRepository.deleteById(id);
    }
}
