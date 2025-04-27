package com.elissandro.hdcontrol.dtos;

import java.io.Serializable;

import com.elissandro.hdcontrol.entities.Product;

public class ProductDTO implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private Long id;
	private String name;
	private String description;
	private String brand;
	private Double price;
	
	public ProductDTO() {
	}
	
	public ProductDTO(Long id, String name, String description, String brand, Double price) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.brand = brand;
		this.price = price;
	}
	
	public ProductDTO(Product entity) {
		this.id = entity.getId();
		this.name = entity.getName();
		this.description = entity.getDescription();
		this.brand = entity.getBrand();
		this.price = entity.getPrice();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
}


