package com.elissandro.hdcontrol.services;

import java.io.Serializable;
import java.time.Instant;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.elissandro.hdcontrol.dtos.PaymentDTO;
import com.elissandro.hdcontrol.entities.Payment;
import com.elissandro.hdcontrol.entities.enums.PaymentStatus;
import com.elissandro.hdcontrol.repositories.OrderRepository;
import com.elissandro.hdcontrol.repositories.PaymentRepository;
import com.elissandro.hdcontrol.services.exceptions.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PaymentService implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Autowired
	private PaymentRepository repository;
	
	@Autowired
	private OrderRepository orderRepository;
	
	PaymentStatus paymentStatus;
	
	@Transactional(readOnly = true)
	public Page<PaymentDTO> findAllPaged(Pageable pageable) {
		Page<Payment> payment = repository.findAll(pageable);
		return payment.map(x -> new PaymentDTO(x));
	}
	
	@Transactional(readOnly = true)
	public PaymentDTO findById(Long id) {
		Optional<Payment> obj = repository.findById(id);
		Payment payment = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
		return new PaymentDTO(payment);
	}
	
	@SuppressWarnings("static-access")
	@Transactional
	public PaymentDTO insert(PaymentDTO dto) {
		Payment entity = new Payment();
		entity.setMoment(Instant.now());
		entity.setStatus(paymentStatus.PENDING);
		entity.setOrder(orderRepository.getReferenceById(dto.getId()));
		entity = repository.save(entity);
		return new PaymentDTO(entity);
	}
	
	@Transactional
	public PaymentDTO update(Long id, PaymentDTO dto) {
		try {
			Payment entity = repository.getReferenceById(id);
			entity.setMoment(Instant.now());
			entity.setStatus(dto.getStatus());
			entity = repository.save(entity);
			return new PaymentDTO(entity);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Id not found " + id);
		}
	}

}
