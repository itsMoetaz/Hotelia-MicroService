package com.hotel.ms.gestionhotel.gestionServices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ServiceRepository extends JpaRepository<HotelService, Integer> {}
