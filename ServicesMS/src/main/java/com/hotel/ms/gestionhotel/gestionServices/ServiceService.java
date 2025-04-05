package com.hotel.ms.gestionhotel.gestionServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServiceService implements IServiceService{
    @Autowired
    private ServiceRepository serviceRepository;
    @Override
    public List<HotelService> getAll() {
        return serviceRepository.findAll();
    }

    @Override
    public HotelService addService(HotelService c) {
        return serviceRepository.save(c);
    }


    public HotelService updateService(int id, HotelService newService) { if (serviceRepository.findById(id).isPresent()) {

        HotelService existingService = serviceRepository.findById(id).get(); existingService.setName(newService.getName()); existingService.setDescription(newService.getDescription()); existingService.setPrice(newService.getPrice()); existingService.setAvailable(newService.getAvailable());
                                        existingService.setOpeningTime(newService.getOpeningTime()); existingService.setClosingTime(newService.getClosingTime());

        return serviceRepository.save(existingService);
    } else
        return null;
    }

    public String deleteService(int id) {
        if (serviceRepository.findById(id).isPresent()) {
            serviceRepository.deleteById(id);
            return "service supprimé";
        } else
            return "service non supprimé";
    }

    @Override
    public HotelService getHotelService(int id) {
        return serviceRepository.findById(id).orElse(null);
    }
}
