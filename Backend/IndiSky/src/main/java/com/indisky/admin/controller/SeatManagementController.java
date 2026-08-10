package com.indisky.admin.controller;

import com.indisky.admin.dto.FlightSeatDto;
import com.indisky.admin.service.FlightSeatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class SeatManagementController {

    private final FlightSeatService seatService;

    @Autowired
    public SeatManagementController(FlightSeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/seats")
    public ResponseEntity<List<FlightSeatDto>> getAllSeats() {
        return ResponseEntity.ok(seatService.getAllSeats());
    }

    @PostMapping("/seats")
    public ResponseEntity<FlightSeatDto> addSeat(@Valid @RequestBody FlightSeatDto dto) {
        return ResponseEntity.ok(seatService.addSeat(dto));
    }

    @PutMapping("/seats/{seatId}")
    public ResponseEntity<FlightSeatDto> updateSeat(@PathVariable Long seatId,
                                                    @Valid @RequestBody FlightSeatDto dto) {
        return ResponseEntity.ok(seatService.updateSeat(seatId, dto));
    }

    @DeleteMapping("/seats/{seatId}")
    public ResponseEntity<?> deleteSeat(@PathVariable Long seatId) {
        seatService.deleteSeat(seatId);
        return ResponseEntity.noContent().build();
    }
}
