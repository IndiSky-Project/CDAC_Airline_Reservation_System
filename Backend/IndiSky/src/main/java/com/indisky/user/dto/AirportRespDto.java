package com.indisky.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.indisky.entities.Flight;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
public class AirportRespDto {

    private Long airportId;

    private String airportName, city, country, iataCode;

}
