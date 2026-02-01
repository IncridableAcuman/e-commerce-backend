package com.server.dto;

import com.server.enums.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;


@Data
public class ProductRequest {

    @NotBlank(message = "The title must be less than 50 characters!")
    @Size(max = 50,message = "The title must be less than 50 characters!")
    private String title;

    @NotBlank(message = "Description must be required!")
    @Size(max = 150,message = "The description must be less than 150 characters!")
    private String description;

    @NotNull(message = "Image must be required!")
    private MultipartFile image;

    @NotNull(message = "The price must be required!")
    private double price;

    @NotNull(message = "Category")
    private Category category;

    @NotNull(message = "Size must be required!")
    private com.server.enums.Size size;
}
