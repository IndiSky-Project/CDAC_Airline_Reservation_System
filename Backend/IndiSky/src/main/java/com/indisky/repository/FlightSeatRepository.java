package com.indisky.repository;

import com.indisky.entities.FlightSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.QueryHints;

import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightSeatRepository extends JpaRepository<FlightSeat, Long> {
    List<FlightSeat> findByFlight_FlightId(Long flightId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT fs FROM FlightSeat fs WHERE fs.id = :id")
    Optional<FlightSeat> findByIdWithLock(@Param("id") Long id);
}
