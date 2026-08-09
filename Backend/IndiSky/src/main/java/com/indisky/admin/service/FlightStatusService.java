package com.indisky.admin.service;

import com.indisky.admin.dto.FlightStatusDto;

import java.util.List;

public interface FlightStatusService {
    List<FlightStatusDto> getAllLogs();
    FlightStatusDto addLog(FlightStatusDto dto);
}
