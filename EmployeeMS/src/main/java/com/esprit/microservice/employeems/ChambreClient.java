package com.esprit.microservice.employeems;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@FeignClient(name = "chambre-s", url = "http://localhost:8082")

public interface ChambreClient {
    @RequestMapping("chambre/all")
    public List<Chambre> getAllChambres();

    @RequestMapping("chambre/{id}")
    public Chambre getChambreById(@PathVariable long id);
}
