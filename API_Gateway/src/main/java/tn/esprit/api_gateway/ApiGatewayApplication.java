package tn.esprit.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator getwayRoutes(RouteLocatorBuilder builder)
    {

        return builder.routes()
                .route("ChambreMS",r->r.path("/chambre/**")
                        .uri("lb://ChambreMS"))

                .route("Evenements", r->r.path("/evenements/**")
                        .uri("http://localhost:8085"))
                .route("GestionReservation",r->r.path("/reservations/**").uri("lb://GestionReservation"))
                .route("Gestionuser",r->r.path("/api/**").uri("lb://Gestionuser"))
                .route("Employee",r -> r.path("/employees/**").uri("lb://EmployeeMS"))
                .route("HotelServices",r -> r.path("/HotelServices/**").uri("lb://HotelServices"))


                .build();
    }
}
