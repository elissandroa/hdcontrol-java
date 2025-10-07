package com.elissandro.hdcontrol.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.elissandro.hdcontrol.entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {


	@Query(value = "SELECT obj FROM Order obj JOIN FETCH obj.items WHERE obj.user.id = :userId",
			countQuery = "SELECT COUNT(obj) FROM Order obj JOIN obj.items WHERE obj.user.id = :userId")
	Page<Order> findAll(Pageable pageable, Integer userId);
	
	@SuppressWarnings("null")
	@Query("SELECT obj FROM Order obj JOIN FETCH obj.items WHERE obj.id = :id")
	Optional<Order> findById(Long id);
	
	@Query(value = "SELECT obj FROM Order obj JOIN FETCH obj.items",
			countQuery = "SELECT COUNT(obj) FROM Order obj JOIN obj.items")
	Page<Order>findAllOrders(Pageable pageable);

	
}
