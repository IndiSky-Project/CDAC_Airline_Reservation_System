package com.indisky.admin.controller;

import com.indisky.admin.dto.FlightStatusDto;
import com.indisky.admin.service.FlightStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/flight-status-logs")
@RequiredArgsConstructor
public class FlightStatusController {

    private final FlightStatusService flightStatusService;

    @GetMapping
    public ResponseEntity<List<FlightStatusDto>> getAllLogs() {
        return ResponseEntity.ok(flightStatusService.getAllLogs());
    }

    @PostMapping
    public ResponseEntity<FlightStatusDto> addLog(@RequestBody FlightStatusDto dto) {
        return ResponseEntity.ok(flightStatusService.addLog(dto));
    }
}
