package com.indisky.user.dto;

import com.indisky.enums.PaymentMethod;
import com.indisky.enums.PaymentStatus;
import lombok.Data;

import java.util.Date;

@Data
public class PaymentResponseDto {
    private Long paymentId;
    private double amountPaid;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private Date paymentDate;
    private Long bookingId;         // Outbound Booking ID (always present)
    private Long returnBookingId;   // Optional – only present for ROUND_TRIP
    private Long userId;
}
