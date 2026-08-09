package com.indisky.user.service.Impl;

import com.indisky.repository.FlightRepository;
import com.indisky.entities.Booking;
import com.indisky.entities.Flight;
import com.indisky.user.dto.FlightResponseDto;
import com.indisky.entities.FlightSeat;
import com.indisky.entities.FlightStatusLog;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.BookingRepository;

import com.indisky.repository.FlightSeatRepository;
import com.indisky.user.dto.FlightDetailsDto;
import com.indisky.user.dto.FlightSeatDto;
import com.indisky.user.dto.FlightStatusDto;
import com.indisky.user.service.FlightService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@Service
@Transactional
@AllArgsConstructor
public class FlightServiceImpl implements FlightService {

    private final ModelMapper modelMapper;
    private final FlightRepository flightRepo;
    private final FlightSeatRepository seatRepo;
    private final BookingRepository bookingRepo;
    private final ModelMapper mapper;

//    @Override
//    public List<Flight> getAllFlights() {
//        return repo.findAll();}

    public FlightDetailsDto getFlightDetails(Long id) {
        Flight flight = flightRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + id));

        FlightDetailsDto dto = new FlightDetailsDto();
        dto.setFlightId(flight.getFlightId());
        dto.setAirlineName(flight.getAirline().getAirlineName());
        dto.setSourceAirport(flight.getSourceAirport().getAirportName());
        dto.setDestinationAirport(flight.getDestinationAirport().getAirportName());
        dto.setFlightNumber(flight.getFlightNumber());
        dto.setDepartureTime(flight.getDepartureTime());
        dto.setArrivalTime(flight.getArrivalTime());
        dto.setBasePrice(flight.getBasePrice());
        dto.setStatus(flight.getStatus());

        return dto;
    }

    public List<FlightSeatDto> getFlightSeats(Long flightId) {
        Flight flight = flightRepo.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));

        List<FlightSeat> seats = flight.getSeats();

        return seats.stream()
                .map(seat -> mapper.map(seat, FlightSeatDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, List<FlightResponseDto>> getSearchFlights(String source, String destination,
                                                                 LocalDate departure, LocalDate arrival,
                                                                 int passengers, String travelclass, String tripType) {

        Map<String, List<FlightResponseDto>> map = new HashMap<>();


        //Problem faced in date -> observation made ->
        //here date we will be receiving is lOcal date but in database we are storing timestamp(date+time)
        //so we will use start and end time for that specific day
        //here in departure end it will give the max time means  1 minute < before next day
        LocalDateTime depStartDate = departure.atStartOfDay();
        LocalDateTime depEndDate = departure.atTime(LocalTime.MAX);

        System.out.println(source + " " + destination + " " + departure + " " + arrival + " -> " + depStartDate + " " + depEndDate);

        List<Flight> onewayFlights = flightRepo.findByDepartureDate(source, destination, depStartDate, depEndDate);

        List<FlightResponseDto> onewayDtoList = new ArrayList<>();
        for (Flight flight : onewayFlights) {
            FlightResponseDto dto = modelMapper.map(flight, FlightResponseDto.class);
            onewayDtoList.add(dto);
        }

        List<FlightResponseDto> roundTripFlightsDtoList = new ArrayList<>();
        if (arrival != null && tripType != null && (tripType.trim().equalsIgnoreCase("roundtrip")
                || tripType.trim().equalsIgnoreCase("round_trip"))) {

            LocalDateTime ArrStartDate = arrival.atStartOfDay();
            LocalDateTime ArrEndDate = arrival.atTime(LocalTime.MAX);
            System.out.println( "Return flights =" +source + " " + destination + " " + departure + " " + arrival + " -> " + ArrStartDate + " " + ArrEndDate);
            List<Flight> roundTripFlightsE = flightRepo.findByDepartureDate(destination, source, ArrStartDate, ArrEndDate);
            for (Flight flight : roundTripFlightsE) {
                FlightResponseDto dto = modelMapper.map(flight, FlightResponseDto.class);
                roundTripFlightsDtoList.add(dto);
            }
        }
        map.put("onewayFlights", onewayDtoList);
        map.put("roundTripFlights", roundTripFlightsDtoList);

        return map;
    }

    @Override
    public FlightStatusDto getFlightStatusByFlightNumber(String flightNumber) {
        Flight flight = flightRepo.findByFlightNumber(flightNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with number: " + flightNumber));

        List<FlightStatusLog> logs = flight.getStatusLogs();

        FlightStatusDto dto = new FlightStatusDto();
        dto.setFlightId(flight.getFlightId());

        if (logs != null && !logs.isEmpty()) {
            // Find latest log without using streams
            FlightStatusLog latestLog = logs.get(0);
            for (int i = 1; i < logs.size(); i++) {
                if (logs.get(i).getUpdatedAt().isAfter(latestLog.getUpdatedAt())) {
                    latestLog = logs.get(i);
                }
            }
            dto.setStatus(latestLog.getStatus());
            dto.setUpdatedAt(latestLog.getUpdatedAt());
        } else {
            // No logs found, fallback to flight status
            dto.setStatus(flight.getStatus());
            dto.setUpdatedAt(null); // or flight.getDepartureTime() or LocalDateTime.now(), as appropriate
        }

        return dto;
    }





}


