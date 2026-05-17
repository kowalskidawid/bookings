package io.ilaro.booking.mapper;

import io.ilaro.booking.dto.ServiceRequest;
import io.ilaro.booking.dto.ServiceResponse;
import io.ilaro.booking.model.Service;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ServiceMapper {

    ServiceResponse toResponse(Service service);

    @Mapping(target = "id", ignore = true)
    Service toEntity(ServiceRequest request);

    @Mapping(target = "id", ignore = true)
    void updateEntity(ServiceRequest request, @MappingTarget Service service);
}
