package com.indisky.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PassengerRequestDto {

    private String fullName;
    private LocalDate dob;
    private String passportNo;
    private String nationality;
}
