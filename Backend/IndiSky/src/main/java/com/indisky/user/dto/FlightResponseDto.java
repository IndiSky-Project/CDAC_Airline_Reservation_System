package com.indisky.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.indisky.entities.*;
import com.indisky.enums.FlightStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FlightResponseDto {

    private Long flightId;

    @JsonIgnoreProperties({"flights", "departures", "arrivals"}) // had to use because casuing infinite recursion that why
    private AirlineRespDto airline;

    @JsonIgnoreProperties({"flights", "departures", "arrivals"})  // had to use because casuing infinite recursion that why same for destination
    private AirportRespDto sourceAirport;

    @JsonIgnoreProperties({"flights", "departures", "arrivals"})
    private AirportRespDto destinationAirport;

    private String flightNumber;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal basePrice;



}
