package io.ilaro.booking.service;

import io.ilaro.booking.dto.UserRequest;
import io.ilaro.booking.dto.UserResponse;
import io.ilaro.booking.exception.ResourceNotFoundException;
import io.ilaro.booking.filter.UserFilter;
import io.ilaro.booking.mapper.UserMapper;
import io.ilaro.booking.model.User;
import io.ilaro.booking.repository.UserRepository;
import io.ilaro.booking.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public Page<UserResponse> findAll(UserFilter filter, Pageable pageable) {
        return userRepository.findAll(UserSpecification.fromFilter(filter), pageable)
                .map(userMapper::toResponse);
    }

    public UserResponse findById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        User user = userMapper.toEntity(request);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        userMapper.updateEntity(request, user);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }
}
