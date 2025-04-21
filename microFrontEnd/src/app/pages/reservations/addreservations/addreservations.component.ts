import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from "../../../services/payment.service";
import { ReservationService } from 'src/app/services/reservation.service';
import { ChambreService } from 'src/app/services/chambre.service';
import { Chambre } from 'src/app/models/Chambre.model';

@Component({
  selector: 'app-addreservations',
  templateUrl: './addreservations.component.html',
  styleUrls: ['./addreservations.component.css']
})
export class AddreservationsComponent implements OnInit {
  reservation = {
    datedebut: '',
    datefin: '',
    idchambre: 0,
    statut: true
  };

  chambres: Chambre[] = [];

  constructor(
    private reservationService: ReservationService,
    private paymentService: PaymentService,
    private chambreService: ChambreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  selectedChambre?: Chambre;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const chambreId = +params['idchambre'];
      if (chambreId) {
        this.reservation.idchambre = chambreId;
  
        // Charger les infos de la chambre
        this.chambreService.getChambreById(chambreId).subscribe(data => {
          this.selectedChambre = data;
        });
      }
    });
  }
  
  saveReservation() {
    this.reservationService.createReservation(this.reservation).subscribe(() => {
      alert('Réservation ajoutée avec succès ✅');
  
      if (this.selectedChambre) {
        const debut = new Date(this.reservation.datedebut);
        const fin = new Date(this.reservation.datefin);
  
        const diffTime = Math.abs(fin.getTime() - debut.getTime());
        const diffJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
        const prixParNuit = this.selectedChambre.prixParNuit;
        const totalPrixCents = diffJours * prixParNuit * 100; // Stripe attend des centimes
  
        const description = `Réservation Chambre ${this.selectedChambre.numero} pour ${diffJours} nuit(s)`;
  
        this.paymentService.pay(description, totalPrixCents).then(result => {
          if (result?.error) {
            console.error('Erreur Stripe :', result.error.message);
          }
        });
      } else {
        console.warn("Chambre non trouvée, paiement non déclenché.");
      }
    });
  }
  
  
}
