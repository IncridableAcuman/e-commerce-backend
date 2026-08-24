package com.server.controller;

import com.server.dto.OrderResponse;
import com.server.entity.Order;
import com.server.entity.User;
import com.server.enums.OrderStatus;
import com.server.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@AuthenticationPrincipal User user) {
        Order order = orderService.checkout(user);
        return ResponseEntity.ok(OrderResponse.from(order));
    }

    // Oddiy foydalanuvchi o'z buyurtmalarini ko'rishi uchun
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(@AuthenticationPrincipal User user) {
        List<Order> orders = orderService.getUserOrders(user);
        List<OrderResponse> response = orders.stream()
                .map(OrderResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    // Admin barcha buyurtmalarni ko'rishi uchun
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderResponse> response = orders.stream()
                .map(OrderResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    // Admin buyurtma statusini o'zgartirishi uchun
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}