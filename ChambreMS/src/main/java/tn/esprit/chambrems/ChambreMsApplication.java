package tn.esprit.chambrems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@SpringBootApplication
public class ChambreMsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChambreMsApplication.class, args);
    }

}
