package com.server.service;

import com.server.dto.CartDto;
import com.server.dto.CartItemDto;
import com.server.dto.ProductResponse;
import com.server.entity.Cart;
import com.server.entity.CartItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartDto toDto(Cart cart) {
        if (cart == null) {
            return null;
        }

        List<CartItemDto> itemDtos = cart.getItems() == null ? List.of() :
                cart.getItems().stream()
                        .map(this::toItemDto)
                        .collect(Collectors.toList());

        double totalAmount = itemDtos.stream()
                .mapToDouble(CartItemDto::getTotal)
                .sum();

        return CartDto.builder()
                .id(cart.getId())
                .items(itemDtos)
                .totalAmount(totalAmount)
                .build();
    }

    public CartItemDto toItemDto(CartItem item) {
        if (item == null) {
            return null;
        }

        return CartItemDto.builder()
                .id(item.getId())
                .product(ProductResponse.from(item.getProduct()))
                .quantity(item.getQuantity())
                .total(item.getTotal())
                .build();
    }
}