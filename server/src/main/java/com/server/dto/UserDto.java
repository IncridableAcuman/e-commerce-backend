package com.server.dto;

import com.server.enums.Role;

public record UserDto(
        long id,
        String username,
        String email,
        Role role
) {
}