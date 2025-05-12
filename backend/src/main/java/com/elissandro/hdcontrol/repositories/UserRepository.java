package com.elissandro.hdcontrol.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elissandro.hdcontrol.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

	User findByEmail(String email);

}
