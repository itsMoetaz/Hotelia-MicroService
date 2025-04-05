import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../models/hotel-service.model';
import { HotelServiceService } from '../../services/hotel-service.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailsComponent implements OnInit {
  service: HotelService | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelServiceService: HotelServiceService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadService(id);
    } else {
      this.error = 'Invalid service ID';
      this.loading = false;
    }
  }

  loadService(id: number): void {
    this.hotelServiceService.getServiceById(id)
      .subscribe({
        next: (data) => {
          this.service = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load service details';
          this.loading = false;
          console.error(err);
        }
      });
  }

  navigateToEdit(): void {
    if (this.service) {
      this.router.navigate(['/services/edit', this.service.id]);
    }
  }

  navigateToList(): void {
    this.router.navigate(['/services']);
  }

  deleteService(): void {
    if (this.service && confirm('Are you sure you want to delete this service?')) {
      this.hotelServiceService.deleteService(this.service.id!)
        .subscribe({
          next: () => {
            this.router.navigate(['/services']);
          },
          error: (err) => {
            this.error = 'Failed to delete service';
            console.error(err);
          }
        });
    }
  }
}