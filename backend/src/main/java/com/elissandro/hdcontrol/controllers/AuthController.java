package com.elissandro.hdcontrol.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.elissandro.hdcontrol.dtos.EmailDTO;
import com.elissandro.hdcontrol.dtos.NewPasswordDTO;
import com.elissandro.hdcontrol.services.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/auth")
public class AuthController {
	
	@Autowired
	private AuthService service;
	
	@PostMapping(value = "/recover-token")
	public ResponseEntity<Void> createRecoverToken(@Valid @RequestBody EmailDTO body){
		service.createRecoverToken(body);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping(value = "/new-password")
	public ResponseEntity<Void> saveNewPassword(@Valid @RequestBody NewPasswordDTO body){
		service.saveNewPassword(body);
		return ResponseEntity.noContent().build();
	}
	
}
