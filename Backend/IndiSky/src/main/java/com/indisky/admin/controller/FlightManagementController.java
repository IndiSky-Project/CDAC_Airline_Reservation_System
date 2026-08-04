package com.indisky.admin.controller;

import com.indisky.admin.dto.FlightAdminDto;
import com.indisky.admin.service.FlightAdminService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/flights")
@AllArgsConstructor
public class FlightManagementController {

    private final FlightAdminService flightAdminService;

    @GetMapping
    public ResponseEntity<List<FlightAdminDto>> getAllFlights() {
        return ResponseEntity.ok(flightAdminService.getAllFlights());
    }

    @PostMapping
    public ResponseEntity<FlightAdminDto> addFlight(@RequestBody FlightAdminDto dto) {
        return ResponseEntity.ok(flightAdminService.addFlight(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlightAdminDto> updateFlight(@PathVariable Long id, @RequestBody FlightAdminDto dto) {
        return ResponseEntity.ok(flightAdminService.updateFlight(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        flightAdminService.deleteFlight(id);
        return ResponseEntity.noContent().build();
    }
}
