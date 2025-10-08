package com.elissandro.hdcontrol.dtos;

import com.elissandro.hdcontrol.entities.OrderItem;

public class OrderItemDTO {
	private ProductDTO product;
	private Integer quantity;
	private Double price;
	private Double subTotal;
	
	public OrderItemDTO() {
	}
	
	public OrderItemDTO(ProductDTO product, Integer quantity, Double price) {
		this.product = product;
		this.quantity = quantity;
		this.price = price;
	}
	
	public OrderItemDTO(OrderItem entity) {
		this.product = new ProductDTO(entity.getProduct());
		this.quantity = entity.getQuantity();
		this.price = entity.getPrice();
		this.subTotal = this.price * this.quantity;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
	
	public ProductDTO getProduct() {
		return product;
	}
	
	public void setProduct(ProductDTO product) {
		this.product = product;
	}
	
	public Double getSubTotal() {
		return subTotal;
	}

}
