package com.elissandro.hdcontrol.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.elissandro.hdcontrol.dtos.OrderDTO;
import com.elissandro.hdcontrol.entities.Order;
import com.elissandro.hdcontrol.services.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orders")
public class OrderController {

	@Autowired
	private OrderService service;

	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER', 'ROLE_CLIENT')")
	@GetMapping
	public ResponseEntity<Page<OrderDTO>> findAll(
			@RequestParam(defaultValue = "") Integer userId,
			Pageable pageable) {
		Page<Order> list = service.findAllPaged(pageable, userId);
		Page<OrderDTO> listDto = list.map(x -> new OrderDTO(x));
		return ResponseEntity.ok().body(listDto);
	}
	
	@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
	@GetMapping("/allorders")
	public ResponseEntity<Page<OrderDTO>> findAllAdmin(
			Pageable pageable) {
		Page<Order> list = service.findAllPagedOrders(pageable);
		Page<OrderDTO> listDto = list.map(x -> new OrderDTO(x));
		return ResponseEntity.ok().body(listDto);
	}

	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER', 'ROLE_CLIENT')")
	@GetMapping("/{id}")
	public ResponseEntity<OrderDTO> findById(@PathVariable Long id) {
		OrderDTO dto = new OrderDTO(service.findById(id));
		return ResponseEntity.ok().body(dto);
	}
	
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
	@PostMapping
	public ResponseEntity<OrderDTO> insert(@Valid @RequestBody OrderDTO dto) {
		Order order = service.insert(dto);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(order.getId()).toUri();
		return ResponseEntity.created(uri).body(new OrderDTO(order));
	}
	
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
	@PutMapping("/{id}")
	public ResponseEntity<OrderDTO> update(@PathVariable Long id,@Valid @RequestBody OrderDTO dto) {
		Order order = service.update(id, dto);
		return ResponseEntity.ok().body(new OrderDTO(order));
	}
	
	@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

}
