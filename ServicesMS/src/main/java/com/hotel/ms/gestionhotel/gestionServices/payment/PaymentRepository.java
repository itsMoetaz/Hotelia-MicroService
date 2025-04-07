package com.hotel.ms.gestionhotel.gestionServices.payment;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentRecord, Integer> {
    List<PaymentRecord> findByServiceId(Integer serviceId);
    List<PaymentRecord> findByStatus(String status);
}