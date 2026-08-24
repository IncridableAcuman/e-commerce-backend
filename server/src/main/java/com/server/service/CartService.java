package com.server.service;

import com.server.dto.CartDto;
import com.server.entity.Cart;
import com.server.entity.CartItem;
import com.server.entity.Product;
import com.server.entity.User;
import com.server.exception.NotFoundException;
import com.server.repository.CartRepository;
import com.server.repository.ProductRepository;
import com.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Cart getOrCreateCart(User user) {
        return cartRepository.findCartByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private Cart getUserCart() {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Foydalanuvchi topilmadi!"));
        return getOrCreateCart(user);
    }

    @Transactional
    public Cart addToCart(User user, long productId, int quantity) {
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Mahsulot topilmadi!"));

        CartItem item = cart.getItems().stream()
                .filter(i -> Objects.equals(i.getProduct().getId(), productId))
                .findFirst()
                .orElse(null);

        if (item != null) {
            item.setQuantity(item.getQuantity() + quantity);
            item.setTotal(product.getPrice() * item.getQuantity());
        } else {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            item.setTotal(product.getPrice() * quantity);
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public CartDto updateItemQuantity(Long itemId, int quantity) {
        Cart cart = getUserCart();

        CartItem item = cart.getItems().stream()
                .filter(i -> Objects.equals(i.getId(), itemId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Savatchada bunday mahsulot topilmadi!"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
            item.setTotal(item.getProduct().getPrice() * quantity);
        }

        Cart updatedCart = cartRepository.save(cart);
        return CartDto.from(updatedCart);
    }

    @Transactional
    public void clearCart() {
        Cart cart = getUserCart();
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}