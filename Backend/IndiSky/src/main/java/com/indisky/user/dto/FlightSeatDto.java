package com.indisky.user.dto;

import com.indisky.enums.TicketClass;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FlightSeatDto {
    private Long seatId;
    private String seatNumber;
    private TicketClass seatClass;
    private boolean booked;
}
