package io.ilaro.booking.controller;

import io.ilaro.booking.model.Service;
import io.ilaro.booking.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173", exposedHeaders = "X-Total-Count", methods = {RequestMethod.GET,
RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceRepository.findAll();
        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(services.size()))
                .body(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getOne(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Service create(@RequestBody Service service) {
        return serviceRepository.save(service);
    }

    @PutMapping("/{id}")
    public Service update(@PathVariable Long id, @RequestBody Service service) {
        service.setId(id);
        return serviceRepository.save(service);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable Long id) {
        serviceRepository.deleteById(id);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }
}