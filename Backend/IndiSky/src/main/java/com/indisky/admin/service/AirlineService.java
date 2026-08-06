package com.indisky.admin.service;

import com.indisky.admin.dto.AirlineDto;
import java.util.List;

public interface AirlineService {
    List<AirlineDto> getAllAirlines();
    AirlineDto addAirline(AirlineDto dto);
    AirlineDto updateAirline(Long id, AirlineDto dto);
    void deleteAirline(Long id);
}
