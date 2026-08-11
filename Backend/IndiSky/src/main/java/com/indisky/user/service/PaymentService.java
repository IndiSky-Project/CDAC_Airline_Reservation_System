package com.indisky.user.service;

import com.indisky.user.dto.PaymentRequestDto;
import com.indisky.user.dto.PaymentResponseDto;

import java.util.List;

public interface PaymentService {
    PaymentResponseDto makePayment(PaymentRequestDto request);
    List<PaymentResponseDto> getPaymentsByUser(Long userId);
}
