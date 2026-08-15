    package com.indisky.entities;

    import com.indisky.enums.*;
    import jakarta.persistence.*;
    import lombok.*;
    import org.hibernate.annotations.CreationTimestamp;

    import java.math.BigDecimal;
    import java.time.LocalDateTime;
    import java.util.List;

    @Entity
    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    @ToString
    @Table(name = "bookings")
    public class Booking {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long bookingId;

        @ManyToOne
        @JoinColumn(name = "user_id")
        private User user;

        @ManyToOne
        @JoinColumn(name = "flight_id")
        private Flight flight;

        @CreationTimestamp
        private LocalDateTime bookingDate;

        private BigDecimal totalPrice;

        @Enumerated(EnumType.STRING)
        private BookingStatus status;

        @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
        private List<Ticket> tickets;

        @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
        private Payment payment;

        public LocalDateTime getId() {
            return null;
        }
    }
