import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/User.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  error: string = '';

  constructor(private userService: UserService,private router: Router) {}

  ngOnInit(): void {
    // Récupérer la liste des utilisateurs lors du chargement du composant
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        this.error = 'Erreur lors de la récupération des utilisateurs.';
        console.error(err);
      }
    });
  }
  
  goToAddUser() {
    this.router.navigate(['/dashboard/user-form']);
  }
  
  goToEditUser(userId: string) {
    this.router.navigate([`/dashboard/user-form/${userId}`]);
  }
  
  deleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          // Actualiser la liste des utilisateurs après suppression
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de l\'utilisateur.';
          console.error(err);
        }
      });
    }
  }
}