package com.indisky.admin.controller;

import com.indisky.admin.service.AdminPaymentService;
import com.indisky.enums.PaymentMethod;
import com.indisky.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/admin/payment")
public class AdminPaymentController {

    private AdminPaymentService adminPaymentService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllPayments(){
        return ResponseEntity.ok(adminPaymentService.getAll());
    }

    @GetMapping("/getByMethodStatus")
    public ResponseEntity<?> getByMethodStatus(@RequestParam PaymentMethod method, @RequestParam PaymentStatus status){
        return ResponseEntity.ok(adminPaymentService.getByMethodStatus(method,status));
    }

}
