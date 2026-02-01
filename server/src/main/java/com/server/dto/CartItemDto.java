package com.server.dto;

import lombok.Data;

@Data
public class CartItemDto {
    private int quantity;
    private double total;
    private String title;
    private double price;
    private String image;
}
