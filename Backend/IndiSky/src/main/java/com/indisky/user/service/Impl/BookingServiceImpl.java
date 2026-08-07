package com.indisky.user.service.Impl;

import com.indisky.entities.*;
import com.indisky.enums.BookingStatus;
import com.indisky.enums.TicketType;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.*;
import com.indisky.user.dto.BookingRequestDto;
import com.indisky.user.dto.BookingResponseDto;
import com.indisky.user.dto.BookingConfirmationDto;
import com.indisky.user.dto.UserBookingDto;
import com.indisky.user.service.BookingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightRepository flightRepository;
    private final PassengerRepository passengerRepository;
    private final FlightSeatRepository flightSeatRepository;
    private final ModelMapper mapper;

    @Override
    public BookingResponseDto createBooking(BookingRequestDto request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        validateSeatOwnership(request.getSeatIds(), request.getFlightId());

        Booking mainBooking = new Booking();
        mainBooking.setUser(user);
        mainBooking.setFlight(flight);
        mainBooking.setTotalPrice(request.getTotalPrice());
        mainBooking.setBookingDate(LocalDateTime.now());
        mainBooking.setStatus(BookingStatus.PENDING);
        Booking savedBooking = bookingRepository.save(mainBooking);

        Booking returnBooking = null;
        if (request.getTicketType().equalsIgnoreCase(TicketType.ROUND_TRIP.name())
                && request.getReturnFlightId() != null) {

            Flight returnFlight = flightRepository.findById(request.getReturnFlightId())
                    .orElseThrow(() -> new ResourceNotFoundException("Return Flight not found"));

            validateSeatOwnership(request.getReturnSeatIds(), request.getReturnFlightId());

            returnBooking = new Booking();
            returnBooking.setUser(user);
            returnBooking.setFlight(returnFlight);
            returnBooking.setTotalPrice(request.getTotalPrice());
            returnBooking.setBookingDate(LocalDateTime.now());
            returnBooking.setStatus(BookingStatus.PENDING);
            returnBooking = bookingRepository.save(returnBooking);
        }

        BookingResponseDto responseDto = mapper.map(savedBooking, BookingResponseDto.class);
        responseDto.setTicketIds(List.of());
        responseDto.setUserId(savedBooking.getUser().getId());
        responseDto.setFlightId(savedBooking.getFlight().getFlightId());

        if (returnBooking != null) {
            responseDto.setReturnBookingId(returnBooking.getBookingId());
        }

        return responseDto;
    }

    private void validateSeatOwnership(List<Long> seatIds, Long flightId) {
        for (Long seatId : seatIds) {
            FlightSeat seat = flightSeatRepository.findById(seatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat with ID " + seatId + " not found"));
            if (!seat.getFlight().getFlightId().equals(flightId)) {
                throw new IllegalArgumentException("Seat ID " + seatId + " does not belong to flight ID " + flightId);
            }
        }
    }

    @Override
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        if (booking.getTickets() != null) {
            booking.getTickets().forEach(ticket -> {
                FlightSeat seat = ticket.getSeat();
                seat.setBooked(false);
                flightSeatRepository.save(seat);
            });
        }
    }

    @Override
    public BookingConfirmationDto getBookingConfirmation(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        List<String> passengerNames = booking.getTickets().stream()
                .map(t -> t.getPassenger().getFullName()).toList();

        List<String> seatNumbers = booking.getTickets().stream()
                .map(t -> t.getSeat().getSeatNumber()).toList();

        return new BookingConfirmationDto(
                booking.getBookingId(),
                booking.getUser().getFullName(),
                booking.getFlight().getFlightNumber(),
                booking.getBookingDate(),
                booking.getFlight().getStatus().name(),
                booking.getStatus().name(),
                booking.getTotalPrice(),
                passengerNames,
                seatNumbers
        );
    }

    @Override
    public List<UserBookingDto> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);

        return bookings.stream().map(booking -> {
            Flight flight = booking.getFlight();

            return new UserBookingDto(
                    booking.getBookingId(),
                    flight.getFlightId(),
                    flight.getSourceAirport().getAirportName(),
                    flight.getDestinationAirport().getAirportName(),
                    flight.getFlightNumber(),
                    booking.getBookingDate(),
                    booking.getTotalPrice(),
                    booking.getStatus().name(),
                    booking.getTickets() != null
                            ? booking.getTickets().stream().map(Ticket::getId).toList()
                            : List.of()
            );
        }).toList();
    }


    @Override
    public BookingResponseDto getUserBookingById(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found for user"));

        BookingResponseDto dto = mapper.map(booking, BookingResponseDto.class);
        dto.setUserId(booking.getUser().getId());
        dto.setFlightId(booking.getFlight().getFlightId());
        dto.setTicketIds(booking.getTickets().stream().map(Ticket::getId).toList());
        return dto;
    }
}
