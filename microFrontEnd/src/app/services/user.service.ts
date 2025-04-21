// src/app/services/user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer la liste des utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, {
      withCredentials: true
    });
  }

  // Méthode pour récupérer l'utilisateur actuel
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/getMe`, {
      withCredentials: true
    });
  }
  // Méthode pour ajouter un utilisateur
  addUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/addUser`, user, {
      withCredentials: true
    });
  }

  // Méthode pour mettre à jour un utilisateur
  updateUser(id: string, user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateUser/${id}`, user, {
      withCredentials: true
    });
  }

  // Méthode pour récupérer un utilisateur par ID
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/getUser/${id}`, {
      withCredentials: true
    });
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/dropUser/${id}`, {
      withCredentials: true
    });
  }
}
