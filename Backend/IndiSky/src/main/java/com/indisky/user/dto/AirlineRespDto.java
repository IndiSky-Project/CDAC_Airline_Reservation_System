package com.indisky.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.indisky.entities.Flight;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;

@Data
public class AirlineRespDto {
    private String airlineName, country;
}
