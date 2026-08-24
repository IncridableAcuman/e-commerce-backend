package com.server.controller;

import com.server.dto.CartDto;
import com.server.entity.Cart;
import com.server.entity.User;
import com.server.service.CartMapper;
import com.server.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal User user){
        Cart cart = cartService.getOrCreateCart(user);
        return ResponseEntity.ok(CartMapper.toDto(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addToCart(@AuthenticationPrincipal User user, @RequestParam long productId, @RequestParam int quantity){
      Cart cart = cartService.addToCart(user,productId,quantity);
      return ResponseEntity.ok(CartMapper.toDto(cart));
    }
}
