package com.elissandro.hdcontrol.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elissandro.hdcontrol.entities.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
