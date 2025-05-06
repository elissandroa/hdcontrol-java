package com.elissandro.hdcontrol.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.elissandro.hdcontrol.entities.Order;
import com.elissandro.hdcontrol.repositories.OrderRepository;

@Service
public class OrderService {

	@Autowired
	private OrderRepository repository;

	@Transactional(readOnly = true)
	public Page<Order> findAllPaged(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Transactional(readOnly = true)
	public Order findById(Long id) {
		Optional<Order> obj = repository.findByOrderId(id);
		Order Order = obj.orElseThrow(() -> new RuntimeException("Entity not found"));
		return Order;
	}

	
}
