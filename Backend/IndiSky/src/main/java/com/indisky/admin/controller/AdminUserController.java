package com.indisky.admin.controller;

import com.indisky.admin.dto.AdminUserDto;
import com.indisky.admin.service.AdminUserService;
import com.indisky.enums.Role;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/admin/user")
public class AdminUserController {
    private AdminUserService userAdminService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(){
        List<AdminUserDto> userList = userAdminService.getAllUsers();
        if(userList.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(userList);
    }

    @PutMapping("/role/{userId}")
    public ResponseEntity<?> updateRoleById(@PathVariable Long userId, @RequestParam Role role) {
        return ResponseEntity.ok(userAdminService.updateRole(userId, role));
    }

    // not needed
    @PutMapping("/resetPass/{userId}")
    public ResponseEntity<?> resetPasswordById(@PathVariable Long userId,@RequestParam String oldPass,@RequestParam String newPass){
        return ResponseEntity.ok(userAdminService.resetPassword(userId,oldPass,newPass));
    }


}
