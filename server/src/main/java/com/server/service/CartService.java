package com.server.service;

import com.server.entity.Cart;
import com.server.entity.CartItem;
import com.server.entity.Product;
import com.server.entity.User;
import com.server.exception.NotFoundException;
import com.server.repository.CartItemRepository;
import com.server.repository.CartRepository;
import com.server.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    // CartService.java
    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findCartByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setItems(new ArrayList<>());
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Cart addToCart(User user, long productId, int quantity) {
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found!"));

        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(ci -> ci.getProduct().getId() == productId)
                .findFirst();

        if (existingCartItem.isPresent()) {
            CartItem ci = existingCartItem.get();
            ci.setQuantity(ci.getQuantity() + quantity);
            ci.setTotal(ci.getQuantity() * product.getPrice());
            cartItemRepository.save(ci);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setTotal(quantity * product.getPrice());
            cartItemRepository.save(item);
            cart.getItems().add(item);
        }
        return cartRepository.save(cart);
    }
}
