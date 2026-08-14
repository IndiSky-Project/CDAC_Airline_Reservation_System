package com.indisky.user.dto;

import com.indisky.enums.BookingStatus;
import com.indisky.enums.FlightStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketPdfDto {
    private Long bookingId;
    private String userName;
    private String flightNumber;
    private String source;
    private String destination;
    private LocalDateTime flightDateTime;
    private List<String> passengerNames;
    private List<String> seatNumbers;
    private String ticketClass;
    private String ticketType;
    private BigDecimal amountPaid;
    private FlightStatus flightStatus;
    private BookingStatus bookingStatus;
    private Date issuedDate;
}
