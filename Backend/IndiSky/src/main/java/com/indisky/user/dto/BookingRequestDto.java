package com.indisky.user.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
public class BookingRequestDto {
    private Long userId;
    private Long flightId;
    private Long returnFlightId;
    private List<Long> seatIds;
    private List<Long> returnSeatIds;
    private BigDecimal totalPrice;
    private String ticketClass;
    private String ticketType;
}