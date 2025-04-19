import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chambre } from '../models/Chambre.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HistoriqueOccupation } from '../models/HistoriqueOccupation';


@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  readonly baseUrl = 'http://localhost:8082/chambre';

  constructor(private http: HttpClient) { }

  getChambreById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.baseUrl}/${id}`);
  }
  // Récupère la liste des chambres
  getChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/all`);
  }
  // Récupère une image
  getImage(imageName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/images/${imageName}`, { 
      responseType: 'blob' 
    });
  }
  // Supprime une chambre
  deleteChambre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  addChambre(formData: FormData): Observable<Chambre> {
  return this.http.post<Chambre>(`${this.baseUrl}/add`, formData);
  }

  updateChambre(id: number, formData: FormData): Observable<Chambre> {
  return this.http.put<Chambre>(`${this.baseUrl}/update/${id}`, formData);
  }
  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError('Quelque chose a mal tourné, veuillez réessayer plus tard.');
  }

   // Ajouter un historique d'occupation
   addHistorique(chambreId: number, historique: HistoriqueOccupation): Observable<HistoriqueOccupation> {
    return this.http.post<HistoriqueOccupation>(`${this.baseUrl}/${chambreId}/historique`, historique);
  }

  // Récupérer l'historique d'occupation d'une chambre
  getHistorique(chambreId: number): Observable<HistoriqueOccupation[]> {
    return this.http.get<HistoriqueOccupation[]>(`${this.baseUrl}/${chambreId}/historique`);
  }
}