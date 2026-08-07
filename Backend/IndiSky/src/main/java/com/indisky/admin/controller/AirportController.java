package com.indisky.admin.controller;

import com.indisky.admin.dto.AirportDto;
import com.indisky.admin.service.AirportService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/airports")
@AllArgsConstructor
public class AirportController {

    private final AirportService airportService;

    @GetMapping
    public ResponseEntity<List<AirportDto>> getAllAirports() {
        return ResponseEntity.ok(airportService.getAllAirports());
    }

    @PostMapping
    public ResponseEntity<AirportDto> addAirport(@Valid @RequestBody AirportDto dto) {
        return ResponseEntity.ok(airportService.addAirport(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AirportDto> updateAirport(@PathVariable Long id, @Valid @RequestBody AirportDto dto) {
        return ResponseEntity.ok(airportService.updateAirport(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAirport(@PathVariable Long id) {
        airportService.deleteAirport(id);
        return ResponseEntity.noContent().build();
    }
}
