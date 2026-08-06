package com.indisky.admin.controller;

import com.indisky.admin.dto.AirlineDto;
import com.indisky.admin.service.AirlineService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/airlines")
@AllArgsConstructor
public class AirlineController {

    private AirlineService airlineService;

    @GetMapping
    public ResponseEntity<List<AirlineDto>> getAllAirlines() {
        return ResponseEntity.ok(airlineService.getAllAirlines());
    }

    @PostMapping
    public ResponseEntity<AirlineDto> addAirline(@Valid @RequestBody AirlineDto dto) {
        return ResponseEntity.ok(airlineService.addAirline(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AirlineDto> updateAirline(@PathVariable Long id, @Valid @RequestBody AirlineDto dto) {
        return ResponseEntity.ok(airlineService.updateAirline(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAirline(@PathVariable Long id) {
        airlineService.deleteAirline(id);
        return ResponseEntity.noContent().build();
    }
}
