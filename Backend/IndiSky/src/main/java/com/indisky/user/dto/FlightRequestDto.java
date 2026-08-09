package com.indisky.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.indisky.entities.*;
import com.indisky.enums.FlightStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FlightRequestDto {

    private Airline airline;
    private Airport sourceAirport;
    private Airport destinationAirport;

    private String flightNumber;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal basePrice;
    private FlightStatus status;

}
