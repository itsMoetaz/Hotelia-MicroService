import { Component } from '@angular/core';
import { ReservationserviceService } from '../../services/reservationservice.service';
import { Router } from '@angular/router';
import {PaymentService} from "../../services/payment.service";

@Component({
  selector: 'app-addreservations',
  templateUrl: './addreservations.component.html',
  styleUrls: ['./addreservations.component.css']
})
export class AddreservationsComponent {
  reservation = {
    datedebut: '',
    datefin: '',
    idchambre: 0,
    statut: true
  };

  constructor(
    private reservationService: ReservationserviceService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  saveReservation() {
    this.reservationService.createReservation(this.reservation).subscribe(() => {
      alert('Réservation ajoutée avec succès ✅');

      // Démarrer le paiement (ex : 20€ → 2000 centimes)
      this.paymentService.pay('Réservation Chambre', 2000).then(result => {
        if (result?.error) {
          console.error('Erreur Stripe :', result.error.message);
        }
      });
    });
  }
}
