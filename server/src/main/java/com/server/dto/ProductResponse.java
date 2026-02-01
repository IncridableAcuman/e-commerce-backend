package com.server.dto;

import com.server.entity.Product;
import com.server.enums.Category;
import com.server.enums.Size;


public record ProductResponse(
        long id,
        String title,
        String description,
        String image,
        double price,
        Category category,
        Size sizes
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getImage(),
                product.getPrice(),
                product.getCategory(),
                product.getSize()
        );
    }
}
