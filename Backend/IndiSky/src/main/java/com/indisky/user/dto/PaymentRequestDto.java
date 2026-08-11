package com.indisky.user.dto;

import com.indisky.enums.PaymentMethod;
import lombok.Data;

import java.util.List;

@Data
public class PaymentRequestDto {
    private Long bookingId; // Primary/first booking (One Way or Departure)
    private Long returnBookingId; // Optional for Round Trip

    private double amountPaid;
    private PaymentMethod paymentMethod;

    private List<Long> passengerIds;     // For main trip
    private List<Long> seatIds;          // For main trip

    private List<Long> returnPassengerIds; // Optional for return
    private List<Long> returnSeatIds;      // Optional for return

    private String ticketClass;
    private String ticketType; // ONE_WAY or ROUND_TRIP
}
