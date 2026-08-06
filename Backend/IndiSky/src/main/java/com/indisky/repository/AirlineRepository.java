package com.indisky.repository;

import com.indisky.entities.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AirlineRepository extends JpaRepository<Airline, Long> {
    boolean existsByAirlineName(String airlineName);
    Optional<Airline> findByAirlineName(String airlineName);

}
