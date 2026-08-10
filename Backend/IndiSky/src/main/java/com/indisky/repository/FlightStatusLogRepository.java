package com.indisky.repository;

import com.indisky.entities.FlightStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlightStatusLogRepository extends JpaRepository<FlightStatusLog, Long> {
}
