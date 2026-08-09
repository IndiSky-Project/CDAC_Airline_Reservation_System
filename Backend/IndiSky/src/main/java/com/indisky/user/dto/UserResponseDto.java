package com.indisky.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserResponseDto {

    private String fullName;

    private String email;

    private String phoneNo;

    private String passportNo;

    private LocalDate birthDate;

}
