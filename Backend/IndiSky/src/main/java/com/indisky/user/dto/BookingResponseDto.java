package com.indisky.user.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponseDto {
    private Long bookingId;
    private Long userId;
    private Long flightId;
    private Long returnBookingId;
    private BigDecimal totalPrice;
    private LocalDateTime bookingDate;
    private String status;
    private List<Long> ticketIds;
}