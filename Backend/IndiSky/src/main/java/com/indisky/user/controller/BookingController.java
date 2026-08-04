package com.indisky.user.controller;

import com.indisky.user.dto.*;
import com.indisky.user.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    @GetMapping("/{id}/confirmation")
    public ResponseEntity<BookingConfirmationDto> getBookingConfirmation(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingConfirmation(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBookingDto>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/user/{userId}/{bookingId}")
    public ResponseEntity<BookingResponseDto> getUserBookingById(
            @PathVariable Long userId,
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getUserBookingById(userId, bookingId));
    }
}