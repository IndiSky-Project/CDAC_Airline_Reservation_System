package com.indisky.user.controller;

import com.indisky.user.dto.FlightDetailsDto;
import com.indisky.user.dto.FlightSeatDto;
import com.indisky.user.dto.FlightStatusDto;
import com.indisky.user.service.FlightService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
@RequestMapping("/api/flights")
public class FlightController {
    private final FlightService flightService;

    @GetMapping("/{id}")
    public FlightDetailsDto getFlightDetails(@PathVariable Long id) {
        return flightService.getFlightDetails(id);
    }

    @GetMapping("/{id}/seats")
    public List<FlightSeatDto> getFlightSeats(@PathVariable Long id) {
        return flightService.getFlightSeats(id);

    }

    @GetMapping("/search")
    public ResponseEntity<?> getBySearchFlights(@RequestParam String source, @RequestParam String destination,
                                                @RequestParam LocalDate departure,
                                                @RequestParam(required = false) LocalDate arrival,
                                                @RequestParam(defaultValue = "1") int passengers,
                                                @RequestParam(defaultValue = "ECONOMY") String travelClass,
                                                @RequestParam(defaultValue = "oneway") String tripType) {
        return ResponseEntity.status(HttpStatus.OK).body(flightService.getSearchFlights(source, destination, departure,
                arrival, passengers,
                travelClass, tripType));
    }

    @GetMapping("/status")
    public FlightStatusDto getFlightStatusByFlightNumber(@RequestParam String flightNumber) {
        return flightService.getFlightStatusByFlightNumber(flightNumber);
    }

}
