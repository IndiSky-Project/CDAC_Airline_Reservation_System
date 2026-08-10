package com.indisky.user.controller;
import com.indisky.user.dto.PassengerRequestDto;
import com.indisky.user.service.PassengerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.indisky.user.dto.PassengerResponseDto;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/passengers")
@RequiredArgsConstructor
public class PassengerController {

    private final PassengerService service;


    @PostMapping("/addlist")
    public ResponseEntity<List<PassengerResponseDto>> addPassengers(@RequestBody List<PassengerRequestDto> psDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addPassengers(psDto));
    }

//    @PutMapping("/update")
//    public ResponseEntity<String> updatePassenger(@RequestBody List<PassengerRespDto> dtos){
//        return ResponseEntity.status(HttpStatus.ACCEPTED).body(service.updatePassengers(dtos));
//    }



    @PostMapping
    public ResponseEntity<PassengerResponseDto> addPassenger(@RequestBody PassengerRequestDto dto) {
        PassengerResponseDto savedPassenger = service.addPassenger(dto);
        return ResponseEntity.ok(savedPassenger);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PassengerResponseDto> getPassenger(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPassengerById(id));
    }
}
