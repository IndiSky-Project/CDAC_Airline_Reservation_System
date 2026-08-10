package com.indisky.user.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserBookingDto {
    private Long bookingId;
    private Long flightId;
    private String sourceAirport;
    private String destinationAirport;
    private String flightNumber;
    private LocalDateTime bookingDate;
    private BigDecimal totalPrice;
    private String status;
    private List<Long> ticketIds;
}
