package com.indisky.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AirportDto {

    private Long airportId;

    @NotBlank(message = "Airport name is required")
    @Size(min = 2, max = 100)
    private String airportName;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 100)
    private String city;

    @NotBlank(message = "Country is required")
    @Size(min = 2, max = 100)
    private String country;

    @NotBlank(message = "IATA code is required")
    @Size(min = 3, max = 3, message = "IATA code must be exactly 3 characters")
    private String iataCode;



}
