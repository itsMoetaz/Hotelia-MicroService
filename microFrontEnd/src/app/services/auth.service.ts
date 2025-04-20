import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/User.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth'; // Ajustez l'URL selon votre configuration
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.user) {
            const user = new User(response.user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.API_URL}/logout`, { withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgotPassword`, { email });
  }

  verifyResetToken(resetToken: string): Observable<any> {
    return this.http.post(`${this.API_URL}/verifyResetToken`, { resetToken });
  }

  resetPassword(email: string, newPassword: string, resetToken: string): Observable<any> {
    return this.http.put(`${this.API_URL}/resetPassword`, { email, newPassword, resetToken });
  }

  verifyEmail(userId: string, verificationToken: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/verify-email`, { userId, verificationToken }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.user) {
            const user = new User(response.user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  // Méthode utilitaire pour obtenir l'en-tête avec le token
  getAuthHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Récupérer le token depuis les cookies
  private getToken(): string {
    // Cette méthode est simplifiée car le token est géré par les cookies HttpOnly
    // Nous utilisons cette méthode pour les appels qui pourraient nécessiter le token dans l'en-tête
    return '';
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
}