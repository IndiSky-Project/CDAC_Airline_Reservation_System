package com.indisky.admin.service;

import com.indisky.admin.dto.AdminUserDto;
import com.indisky.enums.Role;

import java.util.List;

public interface AdminUserService {
    List<AdminUserDto> getAllUsers();

    AdminUserDto updateRole(Long userId, Role role);

    String resetPassword(Long userId, String oldPass, String newPass);
}
