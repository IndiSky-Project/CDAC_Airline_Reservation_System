package com.indisky.repository;

import com.indisky.entities.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight,Long> {

    //here in this code below % called the wild card in sql
    // ?1 and ?2 are called positional parameters refered from spring jpa query docs v3.5.2
    //any where in searchbox appear name then it matches sequence  thats why used before and after the name %
    //observation => @param("") doesnt work for positional parameter

//    @Query("select f from Flight f where lower(f.sourceAirport.city) like lower(concat('%' ,?1 ,'%')) " +
//            "and lower(f.destinationAirport.city) like lower(concat('%' ,?2 ,'%')) " )
//             "and date(f.departureTime)=?3")
//    List<Flight> findByFlightContaining(String source, String destination, LocalDate date);

    //Problem found that jpql has some limitation it does have the date() to match therefore will be using sql query
    //sql query has date() function but research found its not recommeded to use so will be searching between time

    @Query("select f from Flight f where lower(f.sourceAirport.city) like lower(concat('%' ,?1 ,'%')) " +
            "and lower(f.destinationAirport.city) like lower(concat('%' ,?2 ,'%')) " +
             "and f.departureTime between ?3 and ?4")
    List<Flight> findByDepartureDate(String source, String destination, LocalDateTime start , LocalDateTime end);

//    @Query("select f from Flight f where lower(f.sourceAirport.city) like lower(concat('%' ,?1 ,'%')) " +
//            "and lower(f.destinationAirport.city) like lower(concat('%' ,?2 ,'%')) " +
//            "and f.arrivalTime between ?3 and ?4")
//    List<Flight> findByArrivalDate(String source, String destination, LocalDateTime start , LocalDateTime end);

    @Query("""
        SELECT f FROM Flight f
        JOIN FETCH f.airline
        JOIN FETCH f.sourceAirport
        JOIN FETCH f.destinationAirport
    """)
    List<Flight> fetchFlightsWithJoins();




    @Query("select f from Flight f left join fetch f.seats where f.flightId=?1")
    Flight findFlightBySeat(Long flightId);

    @Query("select f from Flight f left join fetch f.statusLogs where f.flightId=?1")
    Flight findByFlightStatus(Long flightId);

    @Query("select f from Flight f left join fetch f.bookings where f.flightId=?1")
    Flight findByFlightByBooking(Long flightId);

    Optional<Flight> findByFlightNumber(String flightNumber);

}
