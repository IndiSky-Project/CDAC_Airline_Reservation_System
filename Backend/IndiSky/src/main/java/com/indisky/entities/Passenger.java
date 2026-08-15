package com.indisky.entities;

import com.indisky.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "passengers")
public class Passenger {
    @Column(name = "passenger_id")
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long passengerId;

    private String fullName;
    private LocalDate dob;
    private String passportNo, nationality;

    @OneToMany(mappedBy = "passenger", cascade = CascadeType.ALL)
    private List<Ticket> tickets;
}

