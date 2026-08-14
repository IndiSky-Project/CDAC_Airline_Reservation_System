package com.indisky.admin.service.Impl;

import com.indisky.admin.dto.AdminBookingDto;
import com.indisky.admin.dto.AdminUserDto;
import com.indisky.admin.service.AdminBookingService;
import com.indisky.entities.Booking;
import com.indisky.entities.User;
import com.indisky.enums.BookingStatus;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.BookingRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class AdminBookingServiceImpl implements AdminBookingService {
    private BookingRepository bookingRepository;
    private ModelMapper modelMapper;

    @Override
    public List<AdminBookingDto> getAllBookings() {

        return bookingRepository.findAll()
                .stream().map(booking->modelMapper.map(booking,AdminBookingDto.class)).toList();
    }

    @Override
    public AdminBookingDto getBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(()->new ResourceNotFoundException("Booking With given Id does not exit.."));

        return modelMapper.map(booking,AdminBookingDto.class);
    }

    @Override
    public AdminBookingDto changeBookingStatus(Long bookingId, BookingStatus bookingStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(()->new ResourceNotFoundException("Booking With given Id does not exit.."));
        booking.setStatus(bookingStatus);
        return modelMapper.map(booking,AdminBookingDto.class);
    }

}
