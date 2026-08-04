package com.indisky.admin.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FlightAdminDto {
    private Long flightId;

    @NotBlank(message = "Flight number is required")
    private String flightNumber;

    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal basePrice;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Airline name is required")
    private String airlineName;

    @NotBlank(message = "Source airport IATA code is required")
    private String sourceAirportIataCode;

    @NotBlank(message = "Destination airport IATA code is required")
    private String destinationAirportIataCode;
}