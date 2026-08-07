package com.indisky.repository;

import com.indisky.entities.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AirportRepository extends JpaRepository<Airport, Long> {
    boolean existsByIataCode(String iataCode);
    Optional<Airport> findByIataCode(String iataCode);
}
