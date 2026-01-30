package com.server.service;

import com.server.dto.ResetPasswordRequest;
import com.server.dto.TokenPair;
import com.server.entity.User;
import com.server.exception.UnAuthorizeException;
import com.server.util.JwtUtil;
import com.server.util.MailUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final MailUtil mailUtil;
    public void resetLink(String email){
        User user = userService.findUserByEmail(email);
        TokenPair tokens = jwtUtil.getTokens(user);
        String token = tokens.accessToken();
        String url = "http://localhost:5173/reset-password?token="+token;
        mailUtil.sendMail(email,"Reset Password",url);
    }
    public void reset(ResetPasswordRequest request){
        if (!jwtUtil.validateToken(request.getToken())){
            throw new UnAuthorizeException("Invalid or expired token!");
        }
        String email = jwtUtil.extractSubject(request.getToken());
        User user = userService.findUserByEmail(email);
        userService.updatePassword(user, request.getPassword());
    }
}
