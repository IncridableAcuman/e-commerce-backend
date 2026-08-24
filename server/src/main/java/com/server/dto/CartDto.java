package com.server.dto;

import com.server.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    private Long id;
    private List<CartItemDto> items;
    private double totalAmount;

    public static CartDto from(Cart cart) {
        List<CartItemDto> itemDtos = cart.getItems() == null ? List.of() :
                cart.getItems().stream()
                        .map(CartItemDto::from)
                        .collect(Collectors.toList());

        double total = itemDtos.stream()
                .mapToDouble(CartItemDto::getTotal)
                .sum();

        return CartDto.builder()
                .id(cart.getId())
                .items(itemDtos)
                .totalAmount(total)
                .build();
    }
}