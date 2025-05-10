package com.elissandro.hdcontrol.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elissandro.hdcontrol.entities.OrderItem;
import com.elissandro.hdcontrol.entities.pk.OrderItemPK;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemPK> {
}
