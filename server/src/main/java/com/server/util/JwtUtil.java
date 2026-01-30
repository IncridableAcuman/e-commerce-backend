package com.server.util;

import com.server.dto.TokenPair;
import com.server.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.refresh_time}")
    private int refreshTime;
    @Value("${jwt.access_time}")
    private int accessTime;

    private Key key;

    @PostConstruct
    public void init(){
         key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user, int expiryDate){
        return Jwts
                .builder()
                .setSubject(user.getEmail())
                .claim("role",user.getRole())
                .claim("id",user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expiryDate))
                .signWith(key)
                .compact();

    }
    public TokenPair getTokens(User user){
        String accessToken = generateToken(user,accessTime);
        String refreshToken = generateToken(user,refreshTime);
        return new TokenPair(accessToken,refreshToken);
    }
    public Claims extractClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String extractSubject(String token){
        return extractClaims(token).getSubject();
    }
    public Date extractExpirationDate(String token){
        return extractClaims(token).getExpiration();
    }
    public boolean validateToken(String token){
        try {
            return extractExpirationDate(token).after(new Date());
        } catch (RuntimeException e) {
            return false;
        }
    }
}
