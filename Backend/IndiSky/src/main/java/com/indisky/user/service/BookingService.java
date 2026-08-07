package com.indisky.user.service;

import com.indisky.user.dto.*;

import java.util.List;

public interface BookingService {
    BookingResponseDto createBooking(BookingRequestDto request);
    void cancelBooking(Long bookingId);
    BookingConfirmationDto getBookingConfirmation(Long bookingId);
    List<UserBookingDto> getUserBookings(Long userId);
    BookingResponseDto getUserBookingById(Long userId, Long bookingId);
}
