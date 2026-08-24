package com.server.dto;

import com.server.entity.OrderItem;

public record OrderItemResponse(
        long id,
        long productId,
        String productTitle,
        String productImage,
        int quantity,
        double price
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getTitle(),
                item.getProduct().getImage(),
                item.getQuantity(),
                item.getPrice()
        );
    }
}