// src/app/components/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/User.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isUpdate = false;
  userId: string | null = null;
  errorMessage: string = '';
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      authentication_method: ['local'],
      role: ['user', [Validators.required]],
      phone_number: ['']
    });
  }

  ngOnInit(): void {
    // Vérifier si nous avons un paramètre d'ID dans l'URL pour la mise à jour
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isUpdate = true;
      this.getUserById(this.userId);
    }
  }

  // Méthode pour récupérer l'utilisateur par ID (pour la mise à jour)
  getUserById(id: string): void {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          phone_number: user.phone_number,
        });
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération de l\'utilisateur';
        console.error(err);
      }
    });
  }

  // Méthode pour soumettre le formulaire d'ajout ou de mise à jour
  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const user: User = this.userForm.value;

    if (this.isUpdate && this.userId) {
      // Mise à jour de l'utilisateur
      this.userService.updateUser(this.userId, user).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/listuser']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour de l\'utilisateur';
          console.error(err);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Ajout d'un nouvel utilisateur
      this.userService.addUser(user).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/listuser']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout de l\'utilisateur';
          console.error(err);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  // Getter pour accéder facilement aux champs du formulaire
  get f() {
    return this.userForm.controls;
  }
}
