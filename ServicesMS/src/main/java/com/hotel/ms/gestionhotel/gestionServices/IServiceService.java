package com.hotel.ms.gestionhotel.gestionServices;

import java.util.List;

public interface IServiceService {

    public List<HotelService> getAll();

    public HotelService addService(HotelService c);

    public HotelService updateService(int id, HotelService newHotelService);

    public String deleteService(int id);

    public HotelService getHotelService(int id);


}
