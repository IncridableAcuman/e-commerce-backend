package com.server.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Entity
@Table(name = "tokens")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Slf4j
@Builder
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "refresh_token",nullable = false)
    private String refreshToken;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime expiryDate;
}
