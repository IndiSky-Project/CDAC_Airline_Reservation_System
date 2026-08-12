package com.indisky.user.controller;

import com.indisky.user.dto.TicketPdfDto;
import com.indisky.user.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ticket")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketPdfService;

    @GetMapping("/download/{bookingId}")
    public TicketPdfDto getTicketData(@PathVariable Long bookingId) {
        return ticketPdfService.generateTicketData(bookingId);
    }
}
