package com.indisky.admin.service.Impl;

import com.indisky.admin.dto.AdminDashboardDto;
import com.indisky.admin.dto.RecentBookingDto;
import com.indisky.admin.dto.RecentPaymentDto;
import com.indisky.admin.service.AdminDashboardService;
import com.indisky.entities.Booking;
import com.indisky.entities.Payment;
import com.indisky.repository.BookingRepository;
import com.indisky.repository.FlightRepository;
import com.indisky.repository.PaymentRepository;
import com.indisky.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final FlightRepository flightRepo;
    private final BookingRepository bookingRepo;
    private final PaymentRepository paymentRepo;
    private final UserRepository userRepo;
    private final ModelMapper mapper;

    @Override
    public AdminDashboardDto getDashboardData() {
        AdminDashboardDto dto = new AdminDashboardDto();
        dto.setTotalFlights((int) flightRepo.count());
        dto.setTotalBookings((int) bookingRepo.count());
        dto.setTotalUsers((int) userRepo.count());

        BigDecimal revenue = paymentRepo.findAll().stream()
                .map(p -> BigDecimal.valueOf(p.getAmountPaid()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalRevenue(revenue);

        List<RecentBookingDto> recentBookings = bookingRepo.findTop5ByOrderByBookingDateDesc()
                .stream()
                .map(this::manualMapBooking)
                .collect(Collectors.toList());

        List<RecentPaymentDto> recentPayments = paymentRepo.findTop5ByOrderByPaymentDateDesc()
                .stream()
                .map(this::manualMapPayment)
                .collect(Collectors.toList());

        dto.setRecentBookings(recentBookings);
        dto.setRecentPayments(recentPayments);

        return dto;
    }

    private RecentBookingDto manualMapBooking(Booking booking) {
        RecentBookingDto dto = new RecentBookingDto();
        dto.setBookingId(booking.getBookingId());
        dto.setUser(booking.getUser().getFullName());
        dto.setDate(booking.getBookingDate());
        dto.setStatus(booking.getStatus().name());
        dto.setTotal(booking.getTotalPrice());
        return dto;
    }

    private RecentPaymentDto manualMapPayment(Payment payment) {
        RecentPaymentDto dto = new RecentPaymentDto();
        dto.setPaymentId(payment.getId());
        dto.setUser(payment.getBooking().getUser().getFullName());
        dto.setMethod(payment.getPaymentMethod().name());
        dto.setStatus(payment.getPaymentStatus().name());
        dto.setAmount(payment.getAmountPaid());
        dto.setDate(payment.getPaymentDate());
        return dto;
    }
}
