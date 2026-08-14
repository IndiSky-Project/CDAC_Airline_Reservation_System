package com.indisky.admin.service;

import com.indisky.admin.dto.AdminBookingDto;
import com.indisky.enums.BookingStatus;

import java.util.List;

public interface AdminBookingService {
    List<AdminBookingDto> getAllBookings();

    AdminBookingDto getBooking(Long bookingId);

    AdminBookingDto changeBookingStatus(Long bookingId, BookingStatus bookingStatus);
}
