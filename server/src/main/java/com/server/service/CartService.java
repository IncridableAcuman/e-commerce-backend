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
import org.springframework.security.core.Authentication;
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
        final User currentUser = (user != null) ? user : getCurrentAuthenticatedUser();

        return cartRepository.findCartByUser(currentUser)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(currentUser);
                    return cartRepository.save(newCart);
                });
    }

    private User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // NullPointerException oldini olish uchun authentication tekshiriladi
        if (authentication == null) {
            throw new NotFoundException("Autentifikatsiya ma'lumotlari topilmadi!");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User u) {
            return u;
        }

        String identifier = authentication.getName();
        return userRepository.findByEmail(identifier)
                .orElseGet(() -> userRepository.findByEmail(identifier)
                        .orElseThrow(() -> new NotFoundException("Foydalanuvchi topilmadi!")));
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
    public CartDto updateItemQuantity(User user, Long itemId, int quantity) {
        Cart cart = getOrCreateCart(user);

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
    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}