package com.hotel.ms.gestionhotel.gestionServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/HotelServices")
public class ServiceRestAPI {

    @Autowired
    private IServiceService iServiceService;

    @GetMapping("/allServices")
    public List<HotelService> getAll(){
        return iServiceService.getAll();
}

    @GetMapping("/ServiceDetails/{id}")
    public HotelService getHotelServiceById(@PathVariable Integer id) {
        return iServiceService.getHotelService(id);
    }

    @PostMapping("/addService")
    public HotelService addHotelService(@RequestBody HotelService service) {
        return iServiceService.addService(service);
    }

    @PutMapping("/updateHotelService/{id}")
    public HotelService updateHotelService(@PathVariable Integer id, @RequestBody HotelService updatedHotelService) {
        HotelService existingService = iServiceService.getHotelService(id);
        if (existingService == null) {
            return null;
        }

        // Only update fields that are not null in the request
        if (updatedHotelService.getName() != null) {
            existingService.setName(updatedHotelService.getName());
        }
        if (updatedHotelService.getDescription() != null) {
            existingService.setDescription(updatedHotelService.getDescription());
        }
        if (updatedHotelService.getDescription() != null) {
            existingService.setDescription(updatedHotelService.getDescription());
        }
        if (updatedHotelService.getPrice() !=0) {
            existingService.setPrice(updatedHotelService.getPrice());
        }
        if (updatedHotelService.getAvailable() != null) {
            existingService.setAvailable(updatedHotelService.getAvailable());
        }
        if (updatedHotelService.getOpeningTime() != null) {
            existingService.setOpeningTime(updatedHotelService.getOpeningTime());
        }
        if (updatedHotelService.getClosingTime() != null) {
            existingService.setClosingTime(updatedHotelService.getClosingTime());
        }
        return iServiceService.updateService(id, existingService);

    }
    @DeleteMapping("/deleteHotelService/{id}")
    public void deleteHotelService(@PathVariable Integer id) {
        iServiceService.deleteService(id);
    }

}
