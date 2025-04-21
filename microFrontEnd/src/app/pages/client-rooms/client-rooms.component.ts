import { Component, OnInit } from '@angular/core';
import { ChambreService } from '../../services/chambre.service';
import { Chambre } from '../../models/Chambre.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-rooms',
  templateUrl: './client-rooms.component.html',
  styleUrls: ['./client-rooms.component.css']
})
export class ClientRoomsComponent implements OnInit {
  chambres: Chambre[] = [];
  filteredChambres: Chambre[] = []; // Define filteredChambres
  isLoading: boolean = false;
  errorMessage: string | null = null;
  baseImageUrl: string = 'http://localhost:8082'; // Base URL for images
  selectedType: string = ''; // Define selectedType
  minPrice: number | null = null; // Define minPrice
  maxPrice: number | null = null; // Define maxPrice

  constructor(private chambreService: ChambreService,    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChambres();
  }

  loadChambres(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.chambreService.getChambres().subscribe({
      next: (data) => {
        this.chambres = data.filter(chambre => chambre.disponibilite);
        this.filteredChambres = [...this.chambres]; // Initialize filtered list
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load rooms. Please try again later.';
        this.isLoading = false;
        console.error('Error loading rooms:', error);
      }
    });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    const cleanImageUrl = imageUrl.replace(/^\/+/, '');
    return `${this.baseImageUrl}/${cleanImageUrl}`;
  }

  filterByType(): void { // Define filterByType
    this.applyFilters();
  }

  filterByPrice(): void { // Define filterByPrice
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredChambres = this.chambres.filter(chambre => {
      // Filter by room type
      const matchesType = this.selectedType ? chambre.type === this.selectedType : true;
      
      // Filter by price range
      const matchesPrice =
        (this.minPrice == null || chambre.prixParNuit >= this.minPrice) &&
        (this.maxPrice == null || chambre.prixParNuit <= this.maxPrice);

      return matchesType && matchesPrice;
    });
  }

  bookRoom(chambreId: number): void {
    this.router.navigate(['/addreservation'], { queryParams: { idchambre: chambreId } });
  }
}