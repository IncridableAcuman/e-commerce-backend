package com.server.service;

import com.server.dto.RegisterRequest;
import com.server.entity.User;
import com.server.enums.Role;
import com.server.exception.BadRequestException;
import com.server.exception.NotFoundException;
import com.server.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User create(RegisterRequest request){
        if (userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new BadRequestException("User already exist!");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        return userRepository.save(user);
    }
    public User findUserByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found!"));
    }

    @Transactional
    public void updatePassword(User user,String password){
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }


}
