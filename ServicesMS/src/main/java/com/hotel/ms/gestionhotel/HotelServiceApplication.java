package com.hotel.ms.gestionhotel;

import com.hotel.ms.gestionhotel.gestionServices.HotelService;
import com.hotel.ms.gestionhotel.gestionServices.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
@EnableDiscoveryClient
public class HotelServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelServiceApplication.class, args);
    }
    @Autowired
    private ServiceRepository serviceRepository;
    @Bean
    ApplicationRunner init() {
        return (args) -> {
// save
            serviceRepository.save(new HotelService("Restaurant", "The Hotel Restaurant", 1000, true, "07:00",  "00:00"));
            serviceRepository.save(new HotelService("Pool", "Large Pool for everyone", 1000, false, "07:00",  "00:00" ));
            serviceRepository.save(new HotelService("Transport", "Transport", 1000, true, "07:00",  "00:00" ));



// fetch
            serviceRepository.findAll().forEach(System.out::println);

        };
    }

}
