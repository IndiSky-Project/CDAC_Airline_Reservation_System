package com.indisky.admin.service.Impl;

import com.indisky.admin.dto.AdminUserDto;
import com.indisky.admin.service.AdminUserService;
import com.indisky.entities.User;
import com.indisky.enums.Role;
import com.indisky.exception.ResourceNotFoundException;
import com.indisky.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class UserAdminServiceImpl implements AdminUserService {
    private UserRepository userRepository;
    private ModelMapper modelMapper;

    @Override
    public List<AdminUserDto> getAllUsers() {
        return userRepository.findAll()
                .stream().
                map(user -> modelMapper.map(user, AdminUserDto.class)).toList();
    }

    @Override
    public AdminUserDto updateRole(Long userId, Role role) {
        User user = userRepository.findById(userId)
                .orElseThrow(()->new ResourceNotFoundException("User With given Id does not exit.."));
        user.setPersonRole(role);
        userRepository.save(user);
        AdminUserDto userDto = modelMapper.map(user,AdminUserDto.class);

        return userDto;
    }

    @Override
    public String resetPassword(Long userId, String oldPass, String newPass) {
        User user = userRepository.findById(userId)
                .orElseThrow(()->new ResourceNotFoundException("User With given Id does not exit.."));
        if(user.getPassword().equals(oldPass)){
            user.setPassword(newPass);
        }else{
            return "Incorrect password!!";
        }
        return "Password reset successful.";
    }
}
