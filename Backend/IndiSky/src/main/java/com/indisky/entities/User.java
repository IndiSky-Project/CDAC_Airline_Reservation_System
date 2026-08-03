package com.indisky.entities;

import com.indisky.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role personRole;

    @Column(name = "full_name")
    private String fullName;

    private String email;

    private String password;

    @Column(name = "phone_no")
    private String phoneNo;

    @Column(name = "passport_no")
    private String passportNo;

    @Column(name = "dob")
    private LocalDate birthDate;

    @CreationTimestamp
    @Column(name = "created_on")
    private Date createdOn;

    @UpdateTimestamp
    @Column(name = "update_on")
    private Date updatedOn;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Booking> bookings;
}
