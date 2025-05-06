package com.elissandro.hdcontrol.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.elissandro.hdcontrol.entities.User;
import com.elissandro.hdcontrol.repositories.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository repository;

	@Transactional(readOnly = true)
	public Page<User> findAllPaged(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Transactional(readOnly = true)
	public User findById(Long id) {
		Optional<User> obj = repository.findById(id);
		User User = obj.orElseThrow(() -> new RuntimeException("Entity not found"));
		return User;
	}

}
