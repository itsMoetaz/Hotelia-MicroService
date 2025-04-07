import { Component, OnInit } from '@angular/core';
import { HotelService } from '../../models/hotel-service.model';
import { HotelServiceService } from '../../services/hotel-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  services: HotelService[] = [];
  filteredServices: HotelService[] = [];
  loading = true;
  error = '';
  searchForm: FormGroup;

  constructor(
    private hotelServiceService: HotelServiceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      priceMin: [''],
      priceMax: [''],
      availabilityFilter: ['all'] // 'all', 'available', 'unavailable'
    });
  }

  ngOnInit(): void {
    this.loadServices();
    
    // Apply filters whenever the form values change
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadServices(): void {
    this.loading = true;
    this.hotelServiceService.getAllServices()
      .subscribe({
        next: (data) => {
          this.services = data;
          this.filteredServices = [...data]; // Initial copy
          this.loading = false;
          this.applyFilters(); // Apply any initial filters
        },
        error: (err) => {
          this.error = 'Failed to load services';
          this.loading = false;
          console.error(err);
        }
      });
  }

  applyFilters(): void {
    const { searchTerm, priceMin, priceMax, availabilityFilter } = this.searchForm.value;
    
    this.filteredServices = this.services.filter(service => {
      // Text search (name and description)
      const matchesSearch = !searchTerm || 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Price range filter
      const minPrice = priceMin !== '' ? parseFloat(priceMin) : Number.MIN_SAFE_INTEGER;
      const maxPrice = priceMax !== '' ? parseFloat(priceMax) : Number.MAX_SAFE_INTEGER;
      const matchesPrice = service.price >= minPrice && service.price <= maxPrice;
      
      // Availability filter
      let matchesAvailability = true;
      if (availabilityFilter === 'available') {
        matchesAvailability = service.available === true;
      } else if (availabilityFilter === 'unavailable') {
        matchesAvailability = service.available === false;
      }
      
      return matchesSearch && matchesPrice && matchesAvailability;
    });
  }

  resetFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      priceMin: '',
      priceMax: '',
      availabilityFilter: 'all'
    });
    // No need to call applyFilters() as it's triggered by valueChanges subscription
  }

  deleteService(id: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.hotelServiceService.deleteService(id)
        .subscribe({
          next: () => {
            this.services = this.services.filter(service => service.id !== id);
            this.applyFilters(); // Re-apply filters after deletion
          },
          error: (err) => {
            this.error = 'Failed to delete service';
            console.error(err);
          }
        });
    }
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/services/edit', id]);
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/services/details', id]);
  }

  navigateToAdd(): void {
    this.router.navigate(['/services/add']);
  }
}