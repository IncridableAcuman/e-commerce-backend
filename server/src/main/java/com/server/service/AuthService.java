package com.server.service;

import com.server.dto.*;
import com.server.entity.User;
import com.server.exception.BadRequestException;
import com.server.exception.UnAuthorizeException;
import com.server.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final  TokenFacade tokenFacade;
    private final PasswordResetService passwordResetService;

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response){
        User user = userService.create(request);
        String accessToken = tokenFacade.issueTokens(user,response);
        return AuthResponse.from(user,accessToken);
    }
    public AuthResponse login(LoginRequest request,HttpServletResponse response){
        User user = userService.findUserByEmail(request.getEmail());
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new BadRequestException("Invalid credentials!");
        }
       String accessToken = tokenFacade.issueTokens(user,response);
        return AuthResponse.from(user,accessToken);
    }
    public AuthResponse refresh(String refreshToken,HttpServletResponse response){
        if (!jwtUtil.validateToken(refreshToken)){
            throw new UnAuthorizeException("Invalid or expired token!");
        }
        String email = jwtUtil.extractSubject(refreshToken);
        User user = userService.findUserByEmail(email);
        String accessToken = tokenFacade.issueTokens(user,response);
        return AuthResponse.from(user,accessToken);
    }
    @Transactional
    public void logout(String refreshToken,HttpServletResponse response){
        String email = jwtUtil.extractSubject(refreshToken);
        User user = userService.findUserByEmail(email);
        tokenFacade.revoke(user,response);
    }
    public void forgotPassword(ForgotPasswordRequest request){
        passwordResetService.resetLink(request.getEmail());
    }
    @Transactional
    public void resetPassword(ResetPasswordRequest request){
      passwordResetService.reset(request);
    }
}
