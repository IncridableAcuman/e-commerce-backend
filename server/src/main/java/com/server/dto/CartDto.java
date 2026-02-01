package com.server.dto;

import lombok.Data;

import java.util.List;

@Data
public class CartDto {
    private long id;
    private List<CartItemDto> items;
    private long userId;
}
