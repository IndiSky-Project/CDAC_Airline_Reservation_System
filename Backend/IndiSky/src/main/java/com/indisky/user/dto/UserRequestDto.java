package com.indisky.user.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserRequestDto {


    private String fullName;

    private String email;

    private String password;

    private String phoneNo;

    private String passportNo;

    private LocalDate birthDate;

}
