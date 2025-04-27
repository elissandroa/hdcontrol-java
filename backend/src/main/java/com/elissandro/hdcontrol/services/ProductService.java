package com.elissandro.hdcontrol.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.elissandro.hdcontrol.entities.Product;
import com.elissandro.hdcontrol.repositories.ProductRepository;

@Service
public class ProductService {

	@Autowired
	private ProductRepository repository;

	@Transactional(readOnly = true)
	public Page<Product> findAllPaged(String name, Pageable pageable) {
		return repository.findProductByName(name, pageable);
	}

	@Transactional(readOnly = true)
	public Product findById(Long id) {
		Optional<Product> obj = repository.findById(id);
		Product product = obj.orElseThrow(() -> new RuntimeException("Product not found"));
		return product;
	}

	@Transactional
	public Product insert(Product product) {
		Product entity = new Product();
		copyDtoToEntity(product, entity);
		entity = repository.save(entity);
		return entity;
	}
	
	@Transactional
	public Product update(Long id, Product product) {
		Product entity = repository.getReferenceById(id);
		copyDtoToEntity(product, entity);
		entity = repository.save(entity);
		return entity;
	}

	private void copyDtoToEntity(Product product, Product entity) {
		entity.setName(product.getName());
		entity.setDescription(product.getDescription());
		entity.setPrice(product.getPrice());
		entity.setBrand(product.getBrand());
	}

}
