package com.esprit.microservice.employeems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class EmployeeMsApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeMsApplication.class, args);
    }

}
