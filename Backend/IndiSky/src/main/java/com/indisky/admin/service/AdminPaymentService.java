package com.indisky.admin.service;

import com.indisky.admin.dto.AdminPaymentDto;
import com.indisky.enums.PaymentMethod;
import com.indisky.enums.PaymentStatus;

import java.util.List;

public interface AdminPaymentService {
    List<AdminPaymentDto> getAll();

    List<AdminPaymentDto> getByMethodStatus(PaymentMethod method, PaymentStatus status);
}
