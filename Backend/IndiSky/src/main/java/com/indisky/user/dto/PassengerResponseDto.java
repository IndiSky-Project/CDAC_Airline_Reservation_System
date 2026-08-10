package com.indisky.user.dto;

import lombok.*;

import java.time.LocalDate;

@Data
public class PassengerResponseDto {
    private Long passengerId;
    private String fullName;
    private LocalDate dob;
    private String passportNo;
    private String nationality;
}
