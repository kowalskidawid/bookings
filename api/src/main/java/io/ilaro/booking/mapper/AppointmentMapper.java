package io.ilaro.booking.mapper;

import io.ilaro.booking.dto.AppointmentRequest;
import io.ilaro.booking.dto.AppointmentResponse;
import io.ilaro.booking.model.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ServiceMapper.class})
public interface AppointmentMapper {

    AppointmentResponse toResponse(Appointment appointment);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "readableId", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "employer", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "status", ignore = true)
    Appointment toEntity(AppointmentRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "readableId", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "employer", ignore = true)
    @Mapping(target = "services", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntity(AppointmentRequest request, @MappingTarget Appointment appointment);
}
