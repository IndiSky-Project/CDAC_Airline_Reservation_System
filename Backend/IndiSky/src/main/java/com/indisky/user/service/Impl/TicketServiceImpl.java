package com.indisky.user.service.Impl;

import com.indisky.entities.*;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.BookingRepository;
import com.indisky.user.dto.TicketPdfDto;
import com.indisky.user.service.TicketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketServiceImpl implements TicketService {

    private final BookingRepository bookingRepo;
    private final ModelMapper modelMapper;

    @Override
    public TicketPdfDto generateTicketData(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        TicketPdfDto dto = new TicketPdfDto();

        modelMapper.map(booking, dto);
        dto.setBookingId(booking.getBookingId());
        dto.setUserName(booking.getUser().getFullName());

        Flight flight = booking.getFlight();
        dto.setFlightNumber(flight.getFlightNumber());
        dto.setSource(flight.getSourceAirport().getAirportName());
        dto.setDestination(flight.getDestinationAirport().getAirportName());
        dto.setFlightDateTime(flight.getDepartureTime());
        dto.setAmountPaid(booking.getTotalPrice());

        dto.setFlightStatus(flight.getStatus());
        dto.setBookingStatus(booking.getStatus());

        if (!booking.getTickets().isEmpty()) {
            Ticket firstTicket = booking.getTickets().get(0);
            dto.setTicketClass(firstTicket.getTicketClass().name());
            dto.setTicketType(firstTicket.getTicketType().name());
            dto.setIssuedDate(firstTicket.getIssuedDate());
        }

        dto.setPassengerNames(
                booking.getTickets().stream()
                        .map(t -> t.getPassenger().getFullName())
                        .toList()
        );

        dto.setSeatNumbers(
                booking.getTickets().stream()
                        .map(t -> t.getSeat().getSeatNumber())
                        .toList()
        );

        return dto;
    }
}

