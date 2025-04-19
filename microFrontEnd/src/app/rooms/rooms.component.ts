import { Component, OnInit } from '@angular/core';
import { Chambre } from '../models/Chambre.model';
import { HistoriqueOccupation } from '../models/HistoriqueOccupation';
import { ChambreService } from '../services/chambre.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HistoriqueFormComponent } from '../pages/historique-form/historique-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  chambres: Chambre[] = [];
  imageErrors: { [key: number]: boolean } = {};
  isLoading: boolean = false;
  errorMessage: string | null = null;
  historiques: HistoriqueOccupation[] = [];
  selectedChambreId: number | null = null;
  showHistorique: boolean = false;
  showHistoriqueForm: boolean = false; // Pour afficher/masquer le formulaire
  currentChambreId: number | null = null; // Pour stocker l'ID de la chambre sélectionnée

  // Variables pour les filtres
  selectedType: string = '';
  types: string[] = ['SIMPLE', 'DOUBLE', 'SUITE'];
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Variables pour les recommandations
  showRecommandations: boolean = false;
  recommandations: Chambre[] = [];
  recommendedForChambreId?: number;

  
  constructor(
    private chambreService: ChambreService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChambres();
  }

  showModal: boolean = false;

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  loadChambres(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.chambreService.getChambres().subscribe({
      next: (data) => {
        this.chambres = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement:', err);
        this.errorMessage = 'Échec du chargement des chambres';
        this.isLoading = false;
      }
    });
  }

  getSafeImageUrl(imageName: string): SafeUrl {
    if (!imageName) {
      return this.sanitizer.bypassSecurityTrustUrl('assets/no-image.png');
    }
    const cleanImageName = imageName.startsWith('/uploads/')
      ? imageName.replace('/uploads/', '')
      : imageName;
    const url = `${this.chambreService.baseUrl}/images/${encodeURIComponent(cleanImageName)}`;
    console.log("Image URL requested: " + url);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  handleImageError(chambreId: number): void {
    this.imageErrors[chambreId] = true;
  }

  deleteChambre(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      this.chambreService.deleteChambre(id).subscribe({
        next: () => {
          this.loadChambres();
        },
        error: (err) => {
          console.error('Échec de la suppression:', err);
          this.errorMessage = 'Échec de la suppression de la chambre';
        }
      });
    }
  }

  editChambre(id: number): void {
    console.log('Navigation vers édition de la chambre', id);
    this.router.navigate([`dashboard/rooms/edit/${id}`]);
  }

  addChambre(): void {
    console.log('Navigation vers ajout de chambre');
    this.router.navigate(['dashboard/rooms/add']);
  }

  navigateToAdd(): void {
    this.router.navigate(['dashboard/chambres/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['dashboard/chambres/edit', id]);
  }

  openHistoriqueDialog(chambreId: number): void {
    this.currentChambreId = chambreId;
    this.showHistoriqueForm = true;
  }

  closeHistoriqueForm(result?: HistoriqueOccupation): void {
    this.showHistoriqueForm = false;
    if (result && this.currentChambreId) {
      console.log('Historique ajouté avec succès :', result);
      if (this.selectedChambreId === this.currentChambreId && this.showHistorique) {
        this.viewHistorique(this.currentChambreId);
      }
    }
    this.currentChambreId = null;
  }

  viewHistorique(chambreId: number): void {
    this.selectedChambreId = chambreId;
    this.showHistorique = true;
    this.chambreService.getHistorique(chambreId).subscribe({
      next: (historiques) => {
        this.historiques = historiques;
      },
      error: (err) => {
        this.errorMessage = 'Échec du chargement de l\'historique';
        console.error('Erreur lors du chargement de l\'historique :', err);
      }
    });
  }

  hideHistorique(): void {
    this.showHistorique = false;
    this.historiques = [];
    this.selectedChambreId = null;
  }

  // Filtrer les chambres disponibles par type
  filterByType(): void {
    if (this.selectedType) {
      this.isLoading = true;
      this.errorMessage = null;
      this.chambreService.getChambresDisponiblesParType(this.selectedType).subscribe({
        next: (data: Chambre[]) => {
          this.chambres = data;
          this.showRecommandations = false;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Erreur lors du filtrage par type:', err);
          this.errorMessage = 'Erreur lors du filtrage par type. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
    } else {
      this.loadChambres();
    }
  }

  // Filtrer les chambres par plage de prix
  filterByPrice(): void {
    if (this.minPrice != null && this.maxPrice != null && this.minPrice <= this.maxPrice) {
      this.isLoading = true;
      this.errorMessage = null;
      this.chambreService.getChambresByPrixRange(this.minPrice, this.maxPrice).subscribe({
        next: (data: Chambre[]) => {
          this.chambres = data;
          this.showRecommandations = false;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Erreur lors du filtrage par prix:', err);
          this.errorMessage = 'Erreur lors du filtrage par prix. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
    } else {
      if (this.minPrice && this.maxPrice && this.minPrice > this.maxPrice) {
        this.errorMessage = 'Le prix minimum ne peut pas être supérieur au prix maximum.';
      } else {
        this.loadChambres();
      }
    }
  }

  // Récupérer les recommandations pour une chambre
  getRecommandations(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.chambreService.recommanderChambresSimilaires(id).subscribe({
      next: (data: Chambre[]) => {
        this.recommandations = data;
        this.showRecommandations = true;
        this.recommendedForChambreId = id;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des recommandations:', err);
        this.errorMessage = 'Erreur lors de la récupération des recommandations. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  // Masquer les recommandations
  hideRecommandations(): void {
    this.showRecommandations = false;
    this.recommandations = [];
    this.recommendedForChambreId = undefined;
  }
}