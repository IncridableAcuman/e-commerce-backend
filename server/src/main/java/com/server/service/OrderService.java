package com.server.service;

import com.server.dto.OrderResponse;
import com.server.entity.*;
import com.server.enums.OrderStatus;
import com.server.exception.BadRequestException;
import com.server.exception.NotFoundException;
import com.server.repository.CartRepository;
import com.server.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    @Transactional
    public Order checkout(User user) {
        Cart cart = cartRepository.findCartByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart is empty!"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty!");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        double total = 0;
        for (CartItem item : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getProduct().getPrice());
            order.getItems().add(orderItem);
            total += item.getTotal();
        }

        order.setTotalAmount(total);

        // Savatchani tozalash
        cart.getItems().clear();
        cartRepository.save(cart);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findAllByUserOrderByCreatedAtDesc(user);
    }

    // Barcha buyurtmalarni olish (Admin uchun)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Buyurtma topilmadi!"));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        return OrderResponse.from(updatedOrder);
    }
}