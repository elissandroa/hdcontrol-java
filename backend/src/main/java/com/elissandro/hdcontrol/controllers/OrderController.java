package com.elissandro.hdcontrol.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.elissandro.hdcontrol.dtos.OrderDTO;
import com.elissandro.hdcontrol.entities.Order;
import com.elissandro.hdcontrol.services.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

	@Autowired
	private OrderService service;
	
	@GetMapping
	public ResponseEntity<Page<OrderDTO>> findAll(Pageable pageable) {
		Page<Order> list = service.findAllPaged(pageable);
		Page<OrderDTO> listDto = list.map(x -> new OrderDTO(x));
		return ResponseEntity.ok().body(listDto);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<OrderDTO> findById(@PathVariable Long id) {
		Order obj = service.findById(id);
		OrderDTO dto = new OrderDTO(obj);
		return ResponseEntity.ok().body(dto);	
	}
	
	
	
}
