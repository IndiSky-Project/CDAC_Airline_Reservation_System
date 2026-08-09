package com.indisky.user.service;

import com.indisky.user.dto.FlightDetailsDto;
import com.indisky.user.dto.FlightResponseDto;
import com.indisky.user.dto.FlightSeatDto;
import com.indisky.user.dto.FlightStatusDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface FlightService {
    FlightDetailsDto getFlightDetails(Long id);
    List<FlightSeatDto> getFlightSeats(Long id);
    FlightStatusDto getFlightStatusByFlightNumber(String flightNumber);
    //List<Flight> getAllFlights();

    Map< String ,List<FlightResponseDto>> getSearchFlights(String source , String destination, LocalDate departure,
                                                           LocalDate arrival,
                                                           int passengers,
                                                           String travelclass, String tripType);



}
