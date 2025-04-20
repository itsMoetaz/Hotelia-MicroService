import {Component, OnInit} from '@angular/core';
import {Reservation, ReservationService} from 'src/app/services/reservation.service';

@Component({
  selector: 'app-listreservations',
  templateUrl: './listreservations.component.html',
  styleUrls: ['./listreservations.component.css']
})
export class ListreservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  loading: boolean = false;
  error: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalReservations: number = 0;
  Math = Math; // Pour pouvoir utiliser Math dans le template

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.error = '';

    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.totalReservations = data.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement des réservations', err);
        this.error = 'Erreur lors du chargement des réservations. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  deleteReservation(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.loading = true;
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.loadReservations(); // refresh après suppression
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.error = 'Erreur lors de la suppression de la réservation.';
          this.loading = false;
        }
      });
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    // Si vous avez une pagination côté serveur, vous pouvez appeler loadReservations avec les paramètres de page
    // Pour l'instant, cette fonction change juste la page pour une pagination côté client
  }
}
