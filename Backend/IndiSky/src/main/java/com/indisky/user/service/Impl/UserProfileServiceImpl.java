package com.indisky.user.service.Impl;

import com.indisky.auth.jwt.JwtService;
import com.indisky.enums.Role;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.UserRepository;
import com.indisky.entities.User;
import com.indisky.user.dto.UserRequestDto;
import com.indisky.user.dto.UserDto;
import com.indisky.user.service.UserProfileService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    private AuthenticationManager authManager;
    private JwtService jwtService;

    @Override
    public String register(UserRequestDto userdto) {

        User userEntity = userRepository.findByEmail(userdto.getEmail());
        if(userEntity!=null){
            return "User Already Registered with Email id- " + userEntity.getEmail();
        }

        User user = modelMapper.map(userdto, User.class);
        if(user!=null){
            user.setPersonRole(Role.USER);
            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            User  savedUser = userRepository.save(user);
            String token = jwtService.generateToken(savedUser);
            return "Registered successfully. Token: " + token;
        }
        return "Failed to Registered!";
    }


    @Override
    public UserDto updateUserDetails(Long userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (userDto.getFullName() != null && !userDto.getFullName().trim().isEmpty())
            user.setFullName(userDto.getFullName().trim());

        if (userDto.getBirthDate() != null)
            user.setBirthDate(userDto.getBirthDate());

        if (userDto.getPhoneNo() != null && !userDto.getPhoneNo().trim().isEmpty())
            user.setPhoneNo(userDto.getPhoneNo().trim());

        if (userDto.getPassportNo() != null && !userDto.getPassportNo().trim().isEmpty())
            user.setPassportNo(userDto.getPassportNo().trim());

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDto.class);
    }

    @Override
    public String verify(UserRequestDto userRequestDto) {

        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                userRequestDto.getEmail(),userRequestDto.getPassword()));
        User user = userRepository.findByEmail(userRequestDto.getEmail());
        if(authentication.isAuthenticated()){
            return jwtService.generateToken(user);
        }
        return null;
    }

    @Override
    public UserDto getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return modelMapper.map(user, UserDto.class);
    }


}
