package com.indisky.user.service.Impl;

import com.indisky.entities.*;
import com.indisky.enums.BookingStatus;
import com.indisky.enums.PaymentStatus;
import com.indisky.enums.TicketClass;
import com.indisky.enums.TicketType;
import com.indisky.exception.InvalidRequestException;
import com.indisky.repository.*;
import com.indisky.user.dto.PaymentRequestDto;
import com.indisky.user.dto.PaymentResponseDto;
import com.indisky.user.service.PaymentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final FlightSeatRepository flightSeatRepository;
    private final TicketRepository ticketRepository;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public PaymentResponseDto makePayment(PaymentRequestDto request) {
        TicketType type = TicketType.valueOf(request.getTicketType());


        Booking outbound = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new InvalidRequestException("Outbound Booking not found"));

        if (outbound.getStatus() != BookingStatus.PENDING) {
            throw new InvalidRequestException("Outbound booking already paid or not allowed");
        }

        if (request.getPassengerIds() == null || request.getSeatIds() == null
                || request.getPassengerIds().size() != request.getSeatIds().size()) {
            throw new InvalidRequestException("Mismatch or missing passenger and seat data for outbound trip");
        }

        List<Ticket> tickets = createTicketsForBooking(outbound,
                request.getPassengerIds(),
                request.getSeatIds(),
                request.getTicketClass(),
                request.getTicketType());

        ticketRepository.saveAll(tickets);
        outbound.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(outbound);

        Booking returnBooking = null;
        if (type == TicketType.ROUND_TRIP) {
            if (request.getReturnBookingId() == null) {
                throw new InvalidRequestException("Return booking ID is required for round trip");
            }

            returnBooking = bookingRepository.findById(request.getReturnBookingId())
                    .orElseThrow(() -> new InvalidRequestException("Return Booking not found"));

            if (returnBooking.getStatus() != BookingStatus.PENDING) {
                throw new InvalidRequestException("Return booking already paid or not allowed");
            }

            if (request.getReturnPassengerIds() == null || request.getReturnSeatIds() == null
                    || request.getReturnPassengerIds().size() != request.getReturnSeatIds().size()) {
                throw new InvalidRequestException("Mismatch or missing passenger and seat data for return trip");
            }

            List<Ticket> returnTickets = createTicketsForBooking(returnBooking,
                    request.getReturnPassengerIds(),
                    request.getReturnSeatIds(),
                    request.getTicketClass(),
                    request.getTicketType());

            ticketRepository.saveAll(returnTickets);
            returnBooking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(returnBooking);
        }

        Payment payment = new Payment();
        payment.setBooking(outbound);
        payment.setAmountPaid(request.getAmountPaid());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        Payment saved = paymentRepository.save(payment);

        PaymentResponseDto response = mapper.map(saved, PaymentResponseDto.class);
        response.setPaymentId(saved.getId());
        response.setBookingId(outbound.getBookingId());
        response.setUserId(outbound.getUser().getId());

        if (returnBooking != null) {
            response.setReturnBookingId(returnBooking.getBookingId());
        }


        return response;
    }
    private List<Ticket> createTicketsForBooking(Booking booking,
                                                 List<Long> passengerIds,
                                                 List<Long> seatIds,
                                                 String ticketClass,
                                                 String ticketType) {
        List<Ticket> tickets = new ArrayList<>();

        for (int i = 0; i < passengerIds.size(); i++) {
            Long passengerId = passengerIds.get(i);
            Long seatId = seatIds.get(i);

            Passenger passenger = passengerRepository.findById(passengerId)
                    .orElseThrow(() -> new InvalidRequestException("Passenger not found: " + passengerId));

            FlightSeat seat = flightSeatRepository.findByIdWithLock(seatId)
                    .orElseThrow(() -> new InvalidRequestException("Seat not found: " + seatId));

            if (seat.isBooked()) {
                throw new InvalidRequestException("Seat already booked: " + seat.getSeatNumber());
            }

            seat.setBooked(true);
            flightSeatRepository.save(seat);

            Ticket ticket = new Ticket();
            ticket.setBooking(booking);
            ticket.setPassenger(passenger);
            ticket.setSeat(seat);
            ticket.setTicketClass(TicketClass.valueOf(ticketClass));
            ticket.setTicketType(TicketType.valueOf(ticketType));

            tickets.add(ticket);
        }

        return tickets;
    }



    @Override
    public List<PaymentResponseDto> getPaymentsByUser(Long userId) {
        return paymentRepository.findByBookingUserId(userId).stream()
                .map(payment -> {
                    PaymentResponseDto dto = mapper.map(payment, PaymentResponseDto.class);
                    dto.setPaymentId(payment.getId());
                    dto.setBookingId(payment.getBooking().getBookingId());
                    dto.setUserId(userId);
                    return dto;
                }).collect(Collectors.toList());
    }
}
