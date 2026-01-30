package com.server.service;

import com.server.entity.Token;
import com.server.entity.User;
import com.server.exception.NotFoundException;
import com.server.repository.TokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final TokenRepository tokenRepository;


    @Transactional
    public void saveToken(User user,String refreshToken){
        Optional<Token> optional = tokenRepository.findByUser(user);
        Token token = optional.orElseGet(Token::new);
        token.setUser(user);
        token.setRefreshToken(refreshToken);
        token.setExpiryDate(LocalDateTime.now().plusDays(7));
        tokenRepository.save(token);
    }
    public void deleteToken(User user){
        Token token = tokenRepository.findByUser(user).orElseThrow(()->new NotFoundException("Token not found!"));
        tokenRepository.delete(token);
    }
}
