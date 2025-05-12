package com.elissandro.hdcontrol.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.elissandro.hdcontrol.dtos.RoleDTO;
import com.elissandro.hdcontrol.dtos.UserDTO;
import com.elissandro.hdcontrol.dtos.UserInsertDTO;
import com.elissandro.hdcontrol.dtos.UserUpdateDTO;
import com.elissandro.hdcontrol.entities.Role;
import com.elissandro.hdcontrol.entities.User;
import com.elissandro.hdcontrol.repositories.RoleRepository;
import com.elissandro.hdcontrol.repositories.UserRepository;
import com.elissandro.hdcontrol.services.exceptions.DatabaseException;
import com.elissandro.hdcontrol.services.exceptions.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

	@Autowired
	private UserRepository repository;
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Transactional(readOnly = true)
	public Page<User> findAllPaged(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Transactional(readOnly = true)
	public User findById(Long id) {
		Optional<User> obj = repository.findById(id);
		User User = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		return User;
	}

	@Transactional
	public UserDTO insert(UserInsertDTO dto) {
		User entity = new User();
		Role role = new Role();
		role.setId(3L);
		dto.getRoles().clear();
		dto.getRoles().add(new RoleDTO(role));
		copyDtoToEntity(dto, entity);
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		entity = repository.save(entity);
		return new UserDTO(entity);
	}
	
	
	@Transactional
	public User update(Long id, UserUpdateDTO dto) {
		try {
			User entity = repository.getReferenceById(id);
			copyDtoToEntity(dto, entity);
			return repository.save(entity);
		} catch (EntityNotFoundException e) {
			throw new RuntimeException("Id not found " + id);
		}
	}
	
	private void copyDtoToEntity(UserDTO dto, User entity) {
		entity.setFirstName(dto.getFirstName());
		entity.setLastName(dto.getLastName());
		entity.setEmail(dto.getEmail());
		entity.setPhone(dto.getPhone());
		entity.getRoles().clear();
		for (RoleDTO roleDto : dto.getRoles()) {
			Role role = new Role();
			role.setId(roleRepository.getReferenceById(roleDto.getId()).getId());
			entity.getRoles().add(role);
		}
	}
	
	@Transactional(propagation = Propagation.SUPPORTS)
	public void delete(Long id) {

		if (!repository.existsById(id)) {
			throw new EntityNotFoundException("Id not found " + id);
		} else {
			try {
				repository.deleteById(id);
			} catch (DataIntegrityViolationException e) {
				throw new DatabaseException("");
			}
		}
	}
}
