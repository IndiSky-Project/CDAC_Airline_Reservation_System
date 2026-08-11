package com.indisky.user.controller;

import com.indisky.user.dto.PaymentRequestDto;
import com.indisky.user.dto.PaymentResponseDto;
import com.indisky.user.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class  PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponseDto> makePayment(@RequestBody PaymentRequestDto request) {
        return ResponseEntity.ok(paymentService.makePayment(request));
    }

    @GetMapping("/user")
    public ResponseEntity<List<PaymentResponseDto>> getUserPayments(@RequestParam Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }
}
