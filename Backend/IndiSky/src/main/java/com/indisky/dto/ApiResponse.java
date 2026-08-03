package com.indisky.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
public class ApiResponse {
    private String message;
    private LocalDateTime timeStamp;
    public ApiResponse(String message) {
        this.message = message;
        this.timeStamp = LocalDateTime.now();
    }
}
