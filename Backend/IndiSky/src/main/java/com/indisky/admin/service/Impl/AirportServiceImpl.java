package com.indisky.admin.service.Impl;

import com.indisky.admin.dto.AirportDto;
import com.indisky.admin.service.AirportService;
import com.indisky.entities.Airport;
import com.indisky.exception.ApiException;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.AirportRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class AirportServiceImpl implements AirportService {

    private final AirportRepository airportRepository;
    private final ModelMapper mapper;

    @Override
    public List<AirportDto> getAllAirports() {
        List<Airport> airports = airportRepository.findAll();
        List<AirportDto> dtos = new ArrayList<>();

        for (Airport airport : airports) {
            AirportDto dto = mapper.map(airport, AirportDto.class);
            dtos.add(dto);
        }

        return dtos;
    }


    @Override
    public AirportDto addAirport(AirportDto dto) {
        if (dto.getIataCode() == null || dto.getIataCode().isEmpty()) {
            throw new ApiException("IATA code cannot be blank");
        }

        if (airportRepository.existsByIataCode(dto.getIataCode())) {
            throw new ApiException("Airport with this IATA code already exists");
        }

        Airport airport = mapper.map(dto, Airport.class);
        Airport saved = airportRepository.save(airport);
        return mapper.map(saved, AirportDto.class);
    }

    @Override
    public AirportDto updateAirport(Long id, AirportDto dto) {
        Airport airport = airportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found"));

        mapper.map(dto, airport);
        Airport updated = airportRepository.save(airport);
        return mapper.map(updated, AirportDto.class);
    }

    @Override
    public void deleteAirport(Long id) {
        if (!airportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Airport not found");
        }
        airportRepository.deleteById(id);
    }
}
