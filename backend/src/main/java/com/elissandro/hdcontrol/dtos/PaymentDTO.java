package com.elissandro.hdcontrol.dtos;

import java.io.Serializable;

import com.elissandro.hdcontrol.entities.Payment;
import com.elissandro.hdcontrol.entities.enums.PaymentStatus;

public class PaymentDTO implements Serializable {
	private static final long serialVersionUID = 1L;

	private Long id;
	private String moment;
	private PaymentStatus status;

	private OrderDTO order;

	public PaymentDTO() {
	}

	public PaymentDTO(Long id, String moment, PaymentStatus status) {
		this.id = id;
		this.moment = moment;
		this.status = status;
	}

	public PaymentDTO(Payment entity) {
		this.id = entity.getId();
		this.moment = entity.getMoment().toString();
		this.status = entity.getStatus();
		this.order = new OrderDTO(entity.getOrder());
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMoment() {
		return moment;
	}

	public void setMoment(String moment) {
		this.moment = moment;
	}

	public OrderDTO getOrder() {
		return order;
	}

	public void setOrder(OrderDTO order) {
		this.order = order;
	}

	public PaymentStatus getStatus() {
		return status;
	}

	public void setStatus(PaymentStatus status) {
		this.status = status;
	}

}
