package com.server.service;

import com.server.dto.CartDto;
import com.server.dto.CartItemDto;
import com.server.entity.Cart;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartMapper {

    public static CartDto toDto(Cart cart){
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());
        List<CartItemDto> items = cart.getItems().stream().map(item -> {
            CartItemDto ci = new CartItemDto();
            ci.setQuantity(item.getQuantity());
            ci.setTotal(item.getTotal());
            ci.setImage(item.getProduct().getImage());
            ci.setTitle(item.getProduct().getTitle());
            ci.setPrice(item.getProduct().getPrice());
            return ci;
        }).toList();
        dto.setItems(items);
        return dto;
    }
}
