package com.server.dto;

import com.server.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private Long id;
    private ProductResponse product;
    private int quantity;
    private double total;

    public static CartItemDto from(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .product(ProductResponse.from(item.getProduct()))
                .quantity(item.getQuantity())
                .total(item.getTotal())
                .build();
    }
}