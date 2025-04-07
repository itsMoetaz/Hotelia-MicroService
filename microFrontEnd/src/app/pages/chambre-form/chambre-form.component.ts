import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Chambre } from '../../models/Chambre.model';
import { ChambreService } from '../../services/chambre.service';

@Component({
  selector: 'app-chambre-form',
  templateUrl: './chambre-form.component.html',
  styleUrls: ['./chambre-form.component.css']
})
export class ChambreFormComponent implements OnInit {
  chambreForm: FormGroup;
  isEditMode = false;
  chambreId: number | null = null;
  loading = false;
  submitted = false;
  error = '';
  currentImageUrl: string | null = null; // Ajout pour stocker l'URL de l'image actuelle

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private chambreService: ChambreService
  ) {
    this.chambreForm = this.fb.group({
      numero: ['', [Validators.required]],
      type: ['SIMPLE', [Validators.required]],
      prixParNuit: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      disponibilite: [true],
      image: [null]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.chambreId = Number(id);
      this.loadChambreDetails(this.chambreId);
    }
  }

  loadChambreDetails(id: number): void {
    this.loading = true;
    this.chambreService.getChambreById(id).subscribe({
      next: (chambre) => {
        this.chambreForm.patchValue({
          numero: chambre.numero,
          type: chambre.type,
          prixParNuit: chambre.prixParNuit,
          disponibilite: chambre.disponibilite
        });
        this.currentImageUrl = chambre.imageUrl; // Stocker l'URL de l'image actuelle
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Échec du chargement des détails de la chambre';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.chambreForm.get('image')?.setValue(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.chambreForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Ajoutez les données de la chambre sous forme de JSON
    const chambreData = {
      numero: this.chambreForm.value.numero,
      type: this.chambreForm.value.type,
      prixParNuit: this.chambreForm.value.prixParNuit,
      description: this.chambreForm.value.description,
      disponibilite: this.chambreForm.value.disponibilite,
      imageUrl: this.chambreForm.value.image ? null : this.currentImageUrl // Inclure l'URL actuelle si aucune nouvelle image n'est sélectionnée
    };

    formData.append('chambre', new Blob([JSON.stringify(chambreData)], {
      type: 'application/json'
    }));

    // Ajoutez l'image si elle existe
    if (this.chambreForm.value.image) {
      formData.append('image', this.chambreForm.value.image);
    }

    if (this.isEditMode && this.chambreId) {
      this.chambreService.updateChambre(this.chambreId, formData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['dashboard/rooms']);
        },
        error: (err) => {
          this.error = 'Échec de la mise à jour';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.chambreService.addChambre(formData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['dashboard/rooms']);
        },
        error: (err) => {
          this.error = "Échec de l'ajout";
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['dashboard/rooms']);
  }
}