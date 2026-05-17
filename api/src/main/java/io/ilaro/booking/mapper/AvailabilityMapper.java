package io.ilaro.booking.mapper;

import io.ilaro.booking.dto.AvailabilityRequest;
import io.ilaro.booking.dto.AvailabilityResponse;
import io.ilaro.booking.model.Availability;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AvailabilityMapper {

    AvailabilityResponse toResponse(Availability availability);

    @Mapping(target = "id", ignore = true)
    Availability toEntity(AvailabilityRequest request);

    @Mapping(target = "id", ignore = true)
    void updateEntity(AvailabilityRequest request, @MappingTarget Availability availability);
}
