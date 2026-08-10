package com.indisky.user.service;

import com.indisky.user.dto.PassengerRequestDto;
import com.indisky.user.dto.PassengerResponseDto;


import java.util.List;

public interface PassengerService {
    PassengerResponseDto addPassenger(PassengerRequestDto dto);
    PassengerResponseDto getPassengerById(Long id);

    List<PassengerResponseDto> addPassengers(List<PassengerRequestDto> passDto);

//
//    List<PassengerRespDto> getAllPassengersByFlight(Long id);  //flight id
//
//    String updatePassengers(List<PassengerRespDto> passengerDtos);
}
