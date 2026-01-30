package com.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource (){
        CorsConfiguration config = new CorsConfiguration();
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization","Accept","Content-Type","Origin","X-Request-With","Cache-Control"));
        config.setExposedHeaders(List.of("Authorization","Content-Disposition"));
        source.registerCorsConfiguration("/**",config);
        return source;
    }
}
