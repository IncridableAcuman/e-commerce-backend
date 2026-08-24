package com.server.repository;

import com.server.entity.Order;
import com.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Foydalanuvchining buyurtmalarini sana bo'yicha saralab olish
    List<Order> findAllByUserOrderByCreatedAtDesc(User user);

    // Barcha buyurtmalarni sana bo'yicha kamayish tartibida olish (Admin uchun)
    List<Order> findAllByOrderByCreatedAtDesc();
}