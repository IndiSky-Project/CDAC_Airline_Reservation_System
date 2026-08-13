package com.indisky.user.service;

import com.indisky.user.dto.TicketPdfDto;

public interface TicketService {
    TicketPdfDto generateTicketData(Long bookingId);
}
