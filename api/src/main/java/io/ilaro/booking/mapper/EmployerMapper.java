package io.ilaro.booking.mapper;

import io.ilaro.booking.dto.EmployerRequest;
import io.ilaro.booking.dto.EmployerResponse;
import io.ilaro.booking.model.Employer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {ServiceMapper.class, AvailabilityMapper.class})
public interface EmployerMapper {

    EmployerResponse toResponse(Employer employer);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userType", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "availabilities", ignore = true)
    Employer toEntity(EmployerRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userType", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "availabilities", ignore = true)
    void updateEntity(EmployerRequest request, @MappingTarget Employer employer);
}
