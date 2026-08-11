package com.indisky.admin.service.Impl;

import com.indisky.admin.dto.FlightSeatDto;
import com.indisky.admin.service.FlightSeatService;
import com.indisky.entities.Flight;
import com.indisky.entities.FlightSeat;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.FlightRepository;
import com.indisky.repository.FlightSeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FlightSeatServiceImpl implements FlightSeatService {

    private final FlightSeatRepository seatRepo;
    private final FlightRepository flightRepo;
    private final ModelMapper mapper;

    @Override
    public List<FlightSeatDto> getAllSeats() {
        List<FlightSeat> seats = seatRepo.findAll();
        return seats.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public FlightSeatDto addSeat(FlightSeatDto dto) {
        Flight flight;

        if (dto.getFlightNumber() != null && !dto.getFlightNumber().isEmpty()) {
            flight = flightRepo.findByFlightNumber(dto.getFlightNumber())
                    .orElseThrow(() -> new ResourceNotFoundException("Flight not found with number: " + dto.getFlightNumber()));
        } else {
            throw new IllegalArgumentException("Flight number is required to add seat");
        }

        FlightSeat seat = new FlightSeat();
        seat.setSeatNumber(dto.getSeatNumber());
        seat.setSeatClass(dto.getSeatClass());
        seat.setBooked(dto.isBooked());
        seat.setFlight(flight);

        FlightSeat saved = seatRepo.save(seat);
        return mapToDto(saved);
    }

    @Override
    public FlightSeatDto updateSeat(Long seatId, FlightSeatDto dto) {
        FlightSeat seat = seatRepo.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found"));

        Flight flight = flightRepo.findById(dto.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        seat.setSeatNumber(dto.getSeatNumber());
        seat.setSeatClass(dto.getSeatClass());
        seat.setBooked(dto.isBooked());
        seat.setFlight(flight);

        FlightSeat updated = seatRepo.save(seat);
        return mapToDto(updated);
    }

    @Override
    public void deleteSeat(Long seatId) {
        if (!seatRepo.existsById(seatId)) {
            throw new ResourceNotFoundException("Seat not found");
        }
        seatRepo.deleteById(seatId);
    }

    private FlightSeatDto mapToDto(FlightSeat seat) {
        FlightSeatDto dto = new FlightSeatDto();
        dto.setSeatId(seat.getSeatId());
        dto.setSeatNumber(seat.getSeatNumber());
        dto.setSeatClass(seat.getSeatClass());
        dto.setBooked(seat.isBooked());
        dto.setFlightId(seat.getFlight().getFlightId());
        dto.setFlightNumber(seat.getFlight().getFlightNumber());
        return dto;
    }


}
