import { Component, Inject, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChambreService } from '../../../services/chambre.service';
import { HistoriqueOccupation } from '../../../models/HistoriqueOccupation';

@Component({
  selector: 'app-historique-form',
  templateUrl: './historique-form.component.html',
  styleUrls: ['./historique-form.component.css']
})
export class HistoriqueFormComponent implements OnInit {
  @Input() chambreId!: number; // ID de la chambre passé en entrée
  @Output() close = new EventEmitter<HistoriqueOccupation | undefined>(); // Événement de fermeture
  historiqueForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private chambreService: ChambreService
  ) {
    this.historiqueForm = this.fb.group({
      locataire: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      duree: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.historiqueForm.invalid) {
      return;
    }

    this.loading = true;
    const historique: HistoriqueOccupation = {
      locataire: this.historiqueForm.value.locataire,
      dateDebut: this.historiqueForm.value.dateDebut,
      dateFin: this.historiqueForm.value.dateFin,
      duree: this.historiqueForm.value.duree
    };

    this.chambreService.addHistorique(this.chambreId, historique).subscribe({
      next: (result) => {
        this.loading = false;
        this.close.emit(result); // Émettre le résultat et fermer
      },
      error: (err) => {
        this.error = 'Échec de l\'ajout de l\'historique';
        this.loading = false;
        console.error('Erreur lors de l\'ajout de l\'historique :', err);
      }
    });
  }

  onCancel(): void {
    this.close.emit(undefined); // Fermer sans résultat
  }
}