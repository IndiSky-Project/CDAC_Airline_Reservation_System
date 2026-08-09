package com.indisky.user.dto;

import com.indisky.enums.FlightStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FlightDetailsDto {
    private Long flightId;
    private String airlineName;
    private String sourceAirport;
    private String destinationAirport;
    private String flightNumber;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal basePrice;
    private FlightStatus status;
}
