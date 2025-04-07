import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelServiceService } from '../../services/hotel-service.service';
import { HotelService } from '../../models/hotel-service.model';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-succes.component.html',
  styleUrls: ['./payment-succes.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  service: HotelService | null = null;
  loading = true;
  error = '';
  transactionId: string = '';
  date: Date = new Date(); // Added the missing date property
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelServiceService: HotelServiceService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.transactionId = this.generateTransactionId();
    
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
  
  // Generate a random transaction ID for demo purposes
  // In a real app, this would come from your backend
  generateTransactionId(): string {
    return 'TXN' + Math.random().toString(36).substring(2, 12).toUpperCase();
  }
  
  navigateToServices(): void {
    this.router.navigate(['/services']);
  }
}