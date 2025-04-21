// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../../models/User.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user?: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Erreur de récupération du profil :', err);
      }
    });
  }
}
