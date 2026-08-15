package com.indisky.admin.service.Impl;

import com.indisky.admin.dto.AdminPaymentDto;
import com.indisky.admin.service.AdminPaymentService;
import com.indisky.entities.Payment;
import com.indisky.enums.PaymentMethod;
import com.indisky.enums.PaymentStatus;
import com.indisky.repository.PaymentRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class AdminPaymentServiceImpl implements AdminPaymentService {

    private PaymentRepository paymentRepository;
    private ModelMapper modelMapper;

    @Override
    public List<AdminPaymentDto> getAll() {
        List<AdminPaymentDto> adminPaymentDtos = paymentRepository.findAll()
                .stream().map(payment -> modelMapper.map(payment,AdminPaymentDto.class)).toList();
        return adminPaymentDtos;
    }

    @Override
    public List<AdminPaymentDto> getByMethodStatus(PaymentMethod method, PaymentStatus status) {
        List<Payment> payments = paymentRepository.getByMethodStatus(method,status);

        return payments
                .stream().map(payment -> modelMapper.map(payment,AdminPaymentDto.class)).toList();
    }

}
