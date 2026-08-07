package com.indisky.admin.service;

import com.indisky.admin.dto.AirportDto;

import java.util.List;

public interface AirportService {
    List<AirportDto> getAllAirports();
    AirportDto addAirport(AirportDto dto);
    AirportDto updateAirport(Long id, AirportDto dto);
    void deleteAirport(Long id);
}
