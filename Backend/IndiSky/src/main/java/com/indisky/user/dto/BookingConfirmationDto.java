package com.indisky.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingConfirmationDto {
    private Long bookingId;
    private String userName;
    private String flightNumber;
    private LocalDateTime bookingDate;
    private String flightStatus;
    private String bookingStatus;
    private BigDecimal totalPrice;
    private List<String> passengerNames;
    private List<String> seatNumbers;
}
