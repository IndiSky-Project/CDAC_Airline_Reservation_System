package com.indisky.user.service;

import com.indisky.user.dto.UserRequestDto;
import com.indisky.user.dto.UserResponseDto;
import com.indisky.user.dto.UserDto;

public interface UserProfileService {
    String register(UserRequestDto userddto);

    UserDto getUserDetails(Long userId);
    UserDto updateUserDetails(Long userId, UserDto userDto);

    String verify(UserRequestDto userRequestDto);
}
