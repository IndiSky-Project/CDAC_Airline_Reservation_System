package com.indisky.admin.service;

import com.indisky.admin.dto.FlightSeatDto;

import java.util.List;

public interface FlightSeatService {
    List<FlightSeatDto> getAllSeats();
    FlightSeatDto addSeat(FlightSeatDto dto);
    FlightSeatDto updateSeat(Long seatId, FlightSeatDto dto);
    void deleteSeat(Long seatId);
}
