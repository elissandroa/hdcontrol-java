package com.elissandro.hdcontrol.dtos;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.elissandro.hdcontrol.entities.Order;
import com.elissandro.hdcontrol.entities.enums.OrderStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;

public class OrderDTO {

	private Long id;
	@NotBlank(message = "Campo obrigatório")
	private String serviceDescription;
	private String observation;
	@PastOrPresent(message = "Data de entrega não pode ser futura")
	private LocalDate deliveryDate;
	private OrderStatus status;
	private Double total;
	
	private UserDTO user;
	
	List<OrderItemDTO> items = new ArrayList<>();
	private int totalQuantity;
	
	List<ProductDTO> products = new ArrayList<>();
	
	public OrderDTO() {
	}
	
	public OrderDTO(Long id, String serviceDescription, String observation, OrderStatus status, LocalDate deliveryDate) {
		this.id = id;
		this.setServiceDescription(serviceDescription);
		this.setObservation(observation);
		this.status = status;
		this.deliveryDate = deliveryDate;
	}
	
	public OrderDTO(Order entity) {
		this.id = entity.getId();
		this.user = new UserDTO(entity.getUser());
		this.setServiceDescription(entity.getServiceDescription());
		this.setObservation(entity.getObservation());
		this.status = entity.getStatus();
		this.deliveryDate = entity.getDeliveryDate();
		entity.getItems().forEach(item -> this.items.add(new OrderItemDTO(item)));
		this.total = entity.getItems().stream()
				.mapToDouble(item -> item.getPrice() * item.getQuantity())
				.sum();
		this.totalQuantity = entity.getItems().stream()
				.mapToInt(item -> item.getQuantity())
				.sum();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDate getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(LocalDate deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}
	
	public List<OrderItemDTO> getItems() {
		return items;
	}
	
	public Double getTotal() {
		return total;
	}

	public String getServiceDescription() {
		return serviceDescription;
	}

	public void setServiceDescription(String serviceDescription) {
		this.serviceDescription = serviceDescription;
	}

	public String getObservation() {
		return observation;
	}

	public void setObservation(String observation) {
		this.observation = observation;
	}
	
	public UserDTO getUser() {
		return user;
	}
	
	public Integer getTotalQuantity() {
		return totalQuantity;
	}
	
	public List<ProductDTO> getProducts() {
		return products;
	}

}
