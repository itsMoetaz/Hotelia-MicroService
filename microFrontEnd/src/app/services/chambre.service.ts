import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Chambre } from '../models/Chambre.model';
import { HistoriqueOccupation } from '../models/HistoriqueOccupation';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  readonly baseUrl = 'http://localhost:8082/chambre';

  constructor(private http: HttpClient) { }

  // Récupère une chambre par ID
  getChambreById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Récupère la liste des chambres
  getChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  // Récupère une image
  getImage(imageName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/images/${imageName}`, { 
      responseType: 'blob' 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Supprime une chambre
  deleteChambre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Ajoute une chambre
  addChambre(formData: FormData): Observable<Chambre> {
    return this.http.post<Chambre>(`${this.baseUrl}/add`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Met à jour une chambre
  updateChambre(id: number, formData: FormData): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.baseUrl}/update/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Ajoute un historique d'occupation
  addHistorique(chambreId: number, historique: HistoriqueOccupation): Observable<HistoriqueOccupation> {
    return this.http.post<HistoriqueOccupation>(`${this.baseUrl}/${chambreId}/historique`, historique).pipe(
      catchError(this.handleError)
    );
  }

  // Récupère l'historique d'occupation d'une chambre
  getHistorique(chambreId: number): Observable<HistoriqueOccupation[]> {
    return this.http.get<HistoriqueOccupation[]>(`${this.baseUrl}/${chambreId}/historique`).pipe(
      catchError(this.handleError)
    );
  }

  // Nouvelle méthode : Recommander des chambres similaires
  recommanderChambresSimilaires(id: number): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/recommander/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Nouvelle méthode : Rechercher les chambres disponibles par type
  getChambresDisponiblesParType(type: string): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/disponibles/type/${type}`).pipe(
      catchError(this.handleError)
    );
  }

  // Nouvelle méthode : Filtrer les chambres par plage de prix
  getChambresByPrixRange(min: number, max: number): Observable<Chambre[]> {
    let params = new HttpParams()
      .set('min', min.toString())
      .set('max', max.toString());
    return this.http.get<Chambre[]>(`${this.baseUrl}/filterByPrix`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError(() => new Error('Quelque chose a mal tourné, veuillez réessayer plus tard.'));
  }
}