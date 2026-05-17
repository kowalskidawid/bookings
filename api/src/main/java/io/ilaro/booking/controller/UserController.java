package io.ilaro.booking.controller;

import io.ilaro.booking.model.User;
import io.ilaro.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", exposedHeaders = "X-Total-Count")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();

        return ResponseEntity.ok()
                .header("X-Total-Count",String.valueOf(users.size()))
                .body(users);
    }
}