import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evenement } from '../models/Evenement.model';


@Injectable({
  providedIn: 'root'
})
export class EvenementService {



  private baseUrl = 'http://localhost:8085/evenements';

  constructor(private http: HttpClient) {}

  //get all events
  getAllEvents(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.baseUrl}/all`);
  }

  //get evenet by id
  getEventById(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.baseUrl}/${id}`);
  }


// add event
  addEvent(evenement: Evenement): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.baseUrl}/add`, evenement);
  }

  //update event
  updateEvent(id: number, evenement: Evenement): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.baseUrl}/update/${id}`, evenement);
  }

  deleteEvent(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/delete/${id}`);
  }

  getByEtatEvent(etat: 'PAYANT' | 'GRATUIT'): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.baseUrl}/etat/${etat}`);

  }

  getSortedByPrixAsc(): Observable<Evenement[]> {

    return this.http.get<Evenement[]>(`${this.baseUrl}/sort/prix/asc`);
  }

  getSortedByPrixDesc(): Observable<Evenement[]> {

    return this.http.get<Evenement[]>(`${this.baseUrl}/sort/prix/desc`);
  }

  //participer evenement by user
  participerEvent(evenementId: number): Observable<string> {
   // return this.apiService.post<string>(`${this.baseEndpoint}/${evenementId}/participer`, {});
    return this.http.post<string>(`${this.baseUrl}/${evenementId}/participer`,  {});
  }
}
