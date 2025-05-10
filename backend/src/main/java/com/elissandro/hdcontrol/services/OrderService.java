package com.elissandro.hdcontrol.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.elissandro.hdcontrol.dtos.OrderDTO;
import com.elissandro.hdcontrol.dtos.OrderItemDTO;
import com.elissandro.hdcontrol.entities.Order;
import com.elissandro.hdcontrol.entities.OrderItem;
import com.elissandro.hdcontrol.entities.Product;
import com.elissandro.hdcontrol.repositories.OrderItemRepository;
import com.elissandro.hdcontrol.repositories.OrderRepository;
import com.elissandro.hdcontrol.repositories.ProductRepository;
import com.elissandro.hdcontrol.repositories.UserRepository;
import com.elissandro.hdcontrol.services.exceptions.DatabaseException;
import com.elissandro.hdcontrol.services.exceptions.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class OrderService {
	

	@Autowired
	private OrderRepository repository;

	@Autowired
	private OrderItemRepository orderItemRepository;
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Transactional(readOnly = true)
	public Page<Order> findAllPaged(Pageable pageable, Integer userId) {
		return repository.findAll(pageable, userId);
	}

	@Transactional(readOnly = true)
	public Order findById(Long id) {
		Optional<Order> obj = repository.findById(id);
		return obj.orElseThrow(() -> new ResourceNotFoundException("Entity not found"));
	}

	@Transactional
	public Order insert(OrderDTO obj) {
		Order entity = new Order();
		copyDtoToEntity(obj, entity);
		entity = repository.save(entity);
		return entity;
	}

	private void copyDtoToEntity(OrderDTO obj, Order entity) {
	    entity.setDeliveryDate(obj.getDeliveryDate());
	    entity.setStatus(obj.getStatus());
	    entity.setObservation(obj.getObservation());
	    entity.setServiceDescription(obj.getServiceDescription());
	    entity.setUser(userRepository.findById(obj.getUser().getId())
	            .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado: ID " + obj.getUser().getId())));

	    entity.getItems().clear();

	    Order savedOrder = repository.save(entity);

	    for (OrderItemDTO item : obj.getItems()) {
	        if (item.getProduct() == null || item.getProduct().getId() == null) {
	            throw new IllegalArgumentException("Produto inválido no item do pedido.");
	        }

	        Product product = productRepository.findById(item.getProduct().getId())
	                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: ID " + item.getProduct().getId()));

	        OrderItem orderItem = new OrderItem();
	        orderItem.setOrder(savedOrder);         
	        orderItem.setProduct(product);          
	        orderItem.setQuantity(item.getQuantity());
	        orderItem.setPrice(item.getPrice());

	        orderItemRepository.save(orderItem);    
	        savedOrder.getItems().add(orderItem);   
	        entity.getProducts().add(product); 
	    }
	}
	
	@Transactional
	public Order update(Long id, OrderDTO obj) {
		try {
			Order entity = repository.getReferenceById(id);
			copyDtoToEntity(obj, entity);
			return repository.save(entity);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Id not found " + id);
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
