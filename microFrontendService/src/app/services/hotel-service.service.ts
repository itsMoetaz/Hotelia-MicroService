import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HotelService } from '../models/hotel-service.model';

@Injectable({
  providedIn: 'root'
})
export class HotelServiceService {
  private baseUrl = 'http://localhost:8000/HotelServices';

  constructor(private http: HttpClient) { }

  getAllServices(): Observable<HotelService[]> {
    return this.http.get<HotelService[]>(`${this.baseUrl}/allServices`);
  }

  getServiceById(id: number): Observable<HotelService> {
    return this.http.get<HotelService>(`${this.baseUrl}/ServiceDetails/${id}`);
  }

  addService(service: HotelService): Observable<HotelService> {
    return this.http.post<HotelService>(`${this.baseUrl}/addService`, service);
  }

  updateService(id: number, service: HotelService): Observable<HotelService> {
    return this.http.put<HotelService>(`${this.baseUrl}/updateHotelService/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteHotelService/${id}`);
  }
}