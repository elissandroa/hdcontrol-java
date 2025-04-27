package com.elissandro.hdcontrol.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.elissandro.hdcontrol.dtos.ProductDTO;
import com.elissandro.hdcontrol.entities.Product;
import com.elissandro.hdcontrol.services.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {

	@Autowired
	private ProductService service;
	
	@GetMapping
	public ResponseEntity<Page<ProductDTO>> findAll(
			@RequestParam(defaultValue = "") String name,
			Pageable pageable
			) {
		Page<Product> list = service.findAllPaged(name, pageable);
		Page<ProductDTO> listDto = list.map(x -> new ProductDTO(x));
		return ResponseEntity.ok().body(listDto);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
		Product obj = service.findById(id);
		ProductDTO dto = new ProductDTO(obj);
		return ResponseEntity.ok().body(dto);	
	}
	
	
	
}
