package com.indisky.admin.service;

import com.indisky.admin.dto.FlightAdminDto;

import java.util.List;

public interface FlightAdminService {
    List<FlightAdminDto> getAllFlights();
    FlightAdminDto addFlight(FlightAdminDto dto);
    FlightAdminDto updateFlight(Long id, FlightAdminDto dto);
    void deleteFlight(Long id);
}