package com.finnax.finnaxApp.services;

import java.util.Optional;
import java.util.UUID;

import com.finnax.finnaxApp.entities.Operation;
import com.finnax.finnaxApp.entities.Payment;

public interface IPaymentService extends CrudService<Payment> {

	public void deleteByOriginalId(UUID id) throws Exception;
	
	public Optional<Payment> findByOriginalId(UUID id) throws Exception;
}
