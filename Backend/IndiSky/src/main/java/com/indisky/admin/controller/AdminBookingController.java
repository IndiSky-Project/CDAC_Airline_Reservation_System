package com.indisky.admin.controller;

import com.indisky.admin.service.AdminBookingService;
import com.indisky.enums.BookingStatus;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@AllArgsConstructor
@RequestMapping("/admin/booking")
public class AdminBookingController {
    private AdminBookingService adminBookingService;

    @GetMapping("/showAll")
    public ResponseEntity<?> getAllBookings(){
        return ResponseEntity.ok(adminBookingService.getAllBookings());
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable Long bookingId){
        return ResponseEntity.ok(adminBookingService.getBooking(bookingId));
    }

    // not needed
    @PutMapping("/changeStatus/{bookingId}")
    public ResponseEntity<?> changeBookingStatus(@PathVariable Long bookingId,@RequestParam BookingStatus bookingStatus){
        return ResponseEntity.ok(adminBookingService.changeBookingStatus(bookingId,bookingStatus));
    }

}
