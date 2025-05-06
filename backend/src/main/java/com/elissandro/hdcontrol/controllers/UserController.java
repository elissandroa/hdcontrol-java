package com.elissandro.hdcontrol.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.elissandro.hdcontrol.dtos.UserDTO;
import com.elissandro.hdcontrol.entities.User;
import com.elissandro.hdcontrol.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserService service;
	
	@GetMapping
	public ResponseEntity<Page<UserDTO>> findAll(Pageable pageable) {
		Page<User> list = service.findAllPaged(pageable);
		Page<UserDTO> listDto = list.map(x -> new UserDTO(x));
		return ResponseEntity.ok().body(listDto);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<UserDTO> findById(@PathVariable Long id) {
		User obj = service.findById(id);
		UserDTO dto = new UserDTO(obj);
		return ResponseEntity.ok().body(dto);	
	}
	
	
	
}
