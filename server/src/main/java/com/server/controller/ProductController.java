package com.server.controller;

import com.server.dto.PageResponse;
import com.server.dto.ProductRequest;
import com.server.dto.ProductResponse;
import com.server.enums.Category;
import com.server.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @ModelAttribute ProductRequest request){
        return ResponseEntity.ok(productService.create(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProductResponse>> getList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ResponseEntity.ok(productService.getList(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id){
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProductResponse> edit(@PathVariable Long id, @Valid @ModelAttribute ProductRequest request){
        return ResponseEntity.ok(productService.edit(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponse<ProductResponse>> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(productService.searchProducts(query, category, minPrice, maxPrice, page, size));
    }
}