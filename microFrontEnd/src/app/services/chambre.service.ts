import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chambre } from '../models/Chambre.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

  // // Ajoute une chambre
  // addChambre(chambre: Chambre): Observable<Chambre> {
  //   return this.http.post<Chambre>(`${this.baseUrl}/add`, chambre);
  // }
//   addChambre(chambre: FormData): Observable<Chambre> {
//     return this.http.post<Chambre>(`${this.baseUrl}/add`, chambre).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // Mettre à jour une chambre
//  /* updateChambre(id: number, formData: FormData): Observable<Chambre> {
//     return this.http.put<Chambre>(`${this.baseUrl}/update/${id}`, formData);
//   }*/

//   updateChambre(id: number, formData: FormData): Observable<Chambre> {
//     return this.http.put<Chambre>(`${this.baseUrl}/update/${id}`, formData).pipe(
//       catchError(this.handleError)
//     );
//   }


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
}