package io.ilaro.booking.service;

import io.ilaro.booking.dto.UserRequest;
import io.ilaro.booking.dto.UserResponse;
import io.ilaro.booking.exception.*;
import io.ilaro.booking.filter.UserFilter;
import io.ilaro.booking.mapper.UserMapper;
import io.ilaro.booking.model.User;
import io.ilaro.booking.repository.UserRepository;
import io.ilaro.booking.specification.UserSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final KeycloakIntegrationService keycloakIntegrationService;
    private final EmailService emailService;

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
        User savedUser = userRepository.save(user);

        String tempPassword = generateTemporaryPassword();

        keycloakIntegrationService.createUserInKeycloak(
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                tempPassword
        );

        emailService.sendWelcomeEmail(savedUser.getEmail(), tempPassword);
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

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }
        try {
            userRepository.deleteById(id);
            userRepository.flush();
            keycloakIntegrationService.deleteUserFromKeycloak(user.getEmail());
        } catch (DataIntegrityViolationException e) {
            throw new ActiveAppointmentsException("Nie można usunąć użytkownika, ponieważ ma przypisane aktywne wizyty");
        }
    }
    private String generateTemporaryPassword()
    {
        SecureRandom random = new SecureRandom();
        String letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String numbersAndSpecials = "0123456789!@#$%^&&*";

        StringBuilder password = new StringBuilder("Customer");

        for (int i=0;i<4;i++)
        {
            password.append(letters.charAt(random.nextInt(letters.length())));
        }

        for (int i = 0; i < 2; i++) {
            password.append(numbersAndSpecials.charAt(random.nextInt(numbersAndSpecials.length())));
        }

        return password.toString();
    }
}
