package com.server.service;

import com.server.dto.TokenPair;
import com.server.entity.User;
import com.server.util.CookieUtil;
import com.server.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class TokenFacade {
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    private final TokenService tokenService;

    public String issueTokens(User user, HttpServletResponse response){
        TokenPair tokens = jwtUtil.getTokens(user);
        tokenService.saveToken(user,tokens.refreshToken());
        cookieUtil.addCookie(tokens.refreshToken(),response);
        return tokens.accessToken();
    }
    public void revoke(User user,HttpServletResponse response){
        tokenService.deleteToken(user);
        cookieUtil.clearCookie(response);
    }
}
