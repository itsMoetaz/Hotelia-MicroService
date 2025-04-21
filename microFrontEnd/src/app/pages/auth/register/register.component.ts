import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      phone_number: [''],
    }, {
      validators: this.passwordMatchValidator
    });
  }
  

  // Custom validator to check if passwords match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Simplifier les données envoyées à l'API - ne garder que ce qui est strictement nécessaire
    const userData = {
      name: this.f['name'].value,
      email: this.f['email'].value.trim().toLowerCase(),
      password: this.f['password'].value,
      phone_number: this.f['phone_number'].value || ''
    };

    console.log('Envoi des données d\'inscription:', userData);

    this.authService.register(userData)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Inscription réussie ! Veuillez vérifier votre email pour les instructions de vérification.';
          this.registerForm.reset();
          setTimeout(() => {
            this.router.navigate(['/login'], { queryParams: { registered: true } });
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erreur lors de l\'inscription:', error);
          
          if (error.status === 409) {
            this.errorMessage = 'Cette adresse email est déjà utilisée.';
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.";
          }
        }
      });
  }
}
