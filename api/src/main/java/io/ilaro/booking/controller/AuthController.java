package io.ilaro.booking.controller;

import io.ilaro.booking.model.User;
import io.ilaro.booking.model.Admin;
import io.ilaro.booking.model.Employer;
import io.ilaro.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(email))
                .findFirst();

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {

            User user = userOpt.get();

            String role = "CUSTOMER";
            if (user instanceof Admin) {
                role = "ADMIN";
            } else if (user instanceof Employer) {
                role = "EMPLOYER";
            }

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", "fake-jwt-token-for-" + email);
            response.put("role", role);
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("message", "Wrong login or password"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser) {

        boolean exists = userRepository.findAll().stream()
                .anyMatch(u -> u.getEmail().equals(newUser.getEmail()));

        if (exists) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "Email jest już zajęty"));
        }

        userRepository.save(newUser);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }
}