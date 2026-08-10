package com.indisky.user.service.Impl;

import com.indisky.entities.Passenger;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.PassengerRepository;
import com.indisky.user.dto.PassengerRequestDto;
import com.indisky.user.dto.PassengerResponseDto;
import com.indisky.user.service.PassengerService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class PassengerServiceImpl implements PassengerService {

    private final ModelMapper modelMapper;
    private final PassengerRepository passengerRepository;

    @Override
    public List<PassengerResponseDto> addPassengers(List<PassengerRequestDto> passDto) {
        if(passDto==null || passDto.isEmpty()){
            return new ArrayList<>();
        }
        List<PassengerResponseDto> dtos = new ArrayList<>();
        for (PassengerRequestDto en : passDto){
            Passenger passenger=modelMapper.map(en,Passenger.class);
            passengerRepository.save(passenger);
            dtos.add(modelMapper.map(passenger, PassengerResponseDto.class));
        }
        return dtos;
    }

    public PassengerResponseDto addPassenger(PassengerRequestDto dto) {
        Passenger passenger = modelMapper.map(dto, Passenger.class);
        Passenger saved = passengerRepository.save(passenger);
        return modelMapper.map(saved, PassengerResponseDto.class);
    }

    @Override
    public PassengerResponseDto getPassengerById(Long id) {
        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found with id: " + id));
        return modelMapper.map(passenger, PassengerResponseDto.class);
    }
}
