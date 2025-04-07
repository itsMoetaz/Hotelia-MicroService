package com.esprit.microservice.evenement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
@EnableDiscoveryClient
@SpringBootApplication
public class EvenementApplication {

    public static void main(String[] args) {
        SpringApplication.run(EvenementApplication.class, args);}



        }

