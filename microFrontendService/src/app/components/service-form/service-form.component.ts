import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../models/hotel-service.model';
import { HotelServiceService } from '../../services/hotel-service.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {
  serviceForm: FormGroup;
  isEditMode = false;
  serviceId: number | null = null;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hotelServiceService: HotelServiceService
  ) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      available: [true, [Validators.required]],
      openingTime: ['', [Validators.required]],
      closingTime: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.serviceId = Number(id);
      this.loadServiceDetails(this.serviceId);
    }
  }

  loadServiceDetails(id: number): void {
    this.loading = true;
    this.hotelServiceService.getServiceById(id)
      .subscribe({
        next: (service) => {
          this.serviceForm.patchValue({
            name: service.name,
            description: service.description,
            price: service.price,
            available: service.available,
            openingTime: service.openingTime,
            closingTime: service.closingTime
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load service details';
          this.loading = false;
          console.error(err);
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.serviceForm.invalid) {
      return;
    }
    
    this.loading = true;
    const serviceData: HotelService = this.serviceForm.value;
    
    if (this.isEditMode && this.serviceId) {
      this.hotelServiceService.updateService(this.serviceId, serviceData)
        .subscribe({
          next: () => {
            this.router.navigate(['/services']);
          },
          error: (err) => {
            this.error = 'Failed to update service';
            this.loading = false;
            console.error(err);
          }
        });
    } else {
      this.hotelServiceService.addService(serviceData)
        .subscribe({
          next: () => {
            this.router.navigate(['/services']);
          },
          error: (err) => {
            this.error = 'Failed to add service';
            this.loading = false;
            console.error(err);
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/services']);
  }
}