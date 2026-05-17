package io.ilaro.booking.mapper;

import io.ilaro.booking.dto.UserRequest;
import io.ilaro.booking.dto.UserResponse;
import io.ilaro.booking.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userType", ignore = true)
    User toEntity(UserRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userType", ignore = true)
    void updateEntity(UserRequest request, @MappingTarget User user);
}
