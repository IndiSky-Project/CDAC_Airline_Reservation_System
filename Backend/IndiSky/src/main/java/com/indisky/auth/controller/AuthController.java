package com.indisky.auth.controller;

import com.indisky.entities.User;
import com.indisky.user.controller.UserProfileController;
import com.indisky.user.dto.UserRequestDto;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/authenticate")
public class AuthController {


//    AuthService authService;
//
////    @PostMapping("/register")
////    public ResponseEntity<?> register(@RequestBody User user){
////        return userProfileController.registerUser(user);
////    }
//    `
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody UserRequestDto userRequestDto){
//        return authService.verify(userRequestDto);
//    }

}
