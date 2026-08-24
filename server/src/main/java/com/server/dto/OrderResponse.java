package com.server.dto;

import com.server.entity.Order;
import com.server.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        long id,
        List<OrderItemResponse> items,
        double totalAmount,
        OrderStatus status,
        LocalDateTime createdAt
) {
    public static OrderResponse from(Order order) {
        List<OrderItemResponse> itemDtos = order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList();

        return new OrderResponse(
                order.getId(),
                itemDtos,
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt()
        );
    }
}