package com.elissandro.hdcontrol.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.elissandro.hdcontrol.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	

	@Query("SELECT obj FROM Product obj WHERE LOWER(obj.name) LIKE LOWER(CONCAT('%', :name, '%'))")
	Page<Product> findProductByName(String name, Pageable pageable);
}
