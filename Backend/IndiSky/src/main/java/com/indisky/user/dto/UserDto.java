
package com.indisky.user.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UserDto {
    private String fullName;
    private LocalDate birthDate; // dob
    private String email;
    private String phoneNo;
    private String passportNo;
}
