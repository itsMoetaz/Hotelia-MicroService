import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Rediriger si déjà connecté
    if (this.authService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  // Getter pour accéder facilement aux champs du formulaire
  get f() {
    return this.loginForm.controls;
  }
  onSubmit(): void {
    this.submitted = true;
  
    // Stop si le formulaire est invalide
    if (this.loginForm.invalid) {
      return;
    }
  
    this.loading = true;
    this.error = '';
  
    this.authService.login(
      this.f['email'].value,
      this.f['password'].value
    ).subscribe({
      next: (response) => {
        // Si la connexion est réussie, l'utilisateur sera retourné dans la réponse
        const user = response.user;
  
        // Vérifier le rôle de l'utilisateur et rediriger en conséquence
        if (user && user.role === 'admin') {
          this.router.navigate(['/dashboard']); // Redirection vers le dashboard de l'admin
        } else {
          this.router.navigate(['/home']); // Redirection vers la page d'accueil pour les autres utilisateurs
        }
      },
      error: error => {
        this.error = error.error.error || 'Une erreur est survenue lors de la connexion';
        this.loading = false;
      }
    });
  }
  
  
  
}
