package com.elissandro.hdcontrol.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.elissandro.hdcontrol.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	
	@Query("SELECT obj FROM Order obj JOIN FETCH obj.items WHERE obj.id = :orderId")
	Optional<Order> findByOrderId(Long orderId);

	@Query("SELECT obj FROM Order obj JOIN FETCH obj.items")
	Page<Order> findAll(Pageable pageable);
}
