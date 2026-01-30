package com.server.dto;

import com.server.entity.User;
import com.server.enums.Role;

public record AuthResponse(
        long id,
        String email,
        Role role,
        String accessToken
) {
    public static AuthResponse from(User user,String accessToken){
        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                accessToken
        );
    }
}
