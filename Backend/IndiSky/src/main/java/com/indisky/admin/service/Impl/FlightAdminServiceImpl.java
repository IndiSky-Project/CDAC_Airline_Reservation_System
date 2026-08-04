package com.indisky.admin.service.Impl;

import com.indisky.admin.dto.FlightAdminDto;
import com.indisky.admin.service.FlightAdminService;
import com.indisky.entities.Airline;
import com.indisky.entities.Airport;
import com.indisky.entities.Flight;
import com.indisky.enums.FlightStatus;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.AirlineRepository;
import com.indisky.repository.AirportRepository;
import com.indisky.repository.FlightRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FlightAdminServiceImpl implements FlightAdminService {

    private final FlightRepository flightRepository;
    private final AirlineRepository airlineRepository;
    private final AirportRepository airportRepository;
    private final ModelMapper mapper;

    @Override
    public List<FlightAdminDto> getAllFlights() {
        List<Flight> flights = flightRepository.fetchFlightsWithJoins();
        List<FlightAdminDto> dtos = new ArrayList<>();

        for (Flight flight : flights) {
            dtos.add(mapEntityToDto(flight));
        }

        return dtos;
    }

    @Override
    public FlightAdminDto addFlight(FlightAdminDto dto) {
        Flight flight = new Flight();
        mapDtoToEntity(dto, flight);
        Flight saved = flightRepository.save(flight);
        return mapEntityToDto(saved);
    }

    @Override
    public FlightAdminDto updateFlight(Long id, FlightAdminDto dto) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        mapDtoToEntity(dto, flight);
        Flight updated = flightRepository.save(flight);
        return mapEntityToDto(updated);
    }

    @Override
    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new ResourceNotFoundException("Flight not found");
        }
        flightRepository.deleteById(id);
    }

    private void mapDtoToEntity(FlightAdminDto dto, Flight flight) {
        flight.setFlightNumber(dto.getFlightNumber());
        flight.setDepartureTime(dto.getDepartureTime());
        flight.setArrivalTime(dto.getArrivalTime());
        flight.setBasePrice(dto.getBasePrice());
        flight.setStatus(FlightStatus.valueOf(dto.getStatus()));

        Airline airline = airlineRepository.findByAirlineName(dto.getAirlineName())
                .orElseThrow(() -> new ResourceNotFoundException("Airline not found"));

        Airport source = airportRepository.findByIataCode(dto.getSourceAirportIataCode())
                .orElseThrow(() -> new ResourceNotFoundException("Source Airport not found"));

        Airport destination = airportRepository.findByIataCode(dto.getDestinationAirportIataCode())
                .orElseThrow(() -> new ResourceNotFoundException("Destination Airport not found"));

        flight.setAirline(airline);
        flight.setSourceAirport(source);
        flight.setDestinationAirport(destination);
    }

    private FlightAdminDto mapEntityToDto(Flight flight) {
        FlightAdminDto dto = mapper.map(flight, FlightAdminDto.class);
        dto.setAirlineName(flight.getAirline().getAirlineName());
        dto.setSourceAirportIataCode(flight.getSourceAirport().getIataCode());
        dto.setDestinationAirportIataCode(flight.getDestinationAirport().getIataCode());
        dto.setStatus(flight.getStatus().name());
        return dto;
    }
}
