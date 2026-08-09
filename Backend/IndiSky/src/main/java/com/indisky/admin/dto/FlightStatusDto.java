package com.indisky.admin.dto;

import com.indisky.enums.FlightStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
public class FlightStatusDto {
    private Long logId;
    private Long flightId;
    private String flightNumber;
    private FlightStatus status;
    private LocalDateTime updatedAt;
}
