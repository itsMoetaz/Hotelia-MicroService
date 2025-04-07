import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/Employee.model';
import { EmployeeService } from 'src/app/services/Employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  employees: Employee[] = [];
  totalEmployees: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  loading: boolean = false;
  error: string | null = null;
  Math = Math;
  constructor(private employeeService: EmployeeService) { }
  ngOnInit(): void {
    this.loadEmployees();
    }

    loadEmployees(): void {
      this.loading = true;
      this.error = null;
      
      this.employeeService.getEmployees(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          // The service now always returns {content, totalElements}
          this.employees = response.content || [];
          this.totalEmployees = response.totalElements || 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching employees', err);
          this.error = 'Failed to load employees. Please try again later.';
          this.loading = false;
          this.employees = [];
          this.totalEmployees = 0;
        }
      });
  }
  
    changePage(page: number): void {
      if (page >= 0 && page < Math.ceil(this.totalEmployees / this.pageSize)) {
        this.currentPage = page;
        this.loadEmployees();
      }
    }
  
    calculateStars(rating: number): number[] {
      if (!rating && rating !== 0) return Array(5).fill(0);
      
      const fullStars = Math.floor(rating / 2);
      const stars = Array(5).fill(0);
      
      for (let i = 0; i < fullStars && i < 5; i++) {
        stars[i] = 1;
      }
      
      return stars;
    }
  
    getFullName(employee: Employee): string {
      if (!employee) return '';
      return `${employee.firstName || ''} ${employee.lastName || ''}`;
    }
  
    addEmployee(): void {
      // Open add form
    }
  
    viewEmployee(id: string): void {
      // Navigate to employee details page
    }
  
    editEmployee(employee: Employee): void {
      // Open edit form
    }
  
    deleteEmployee(id: string ): void {
      if (confirm('Are you sure you want to delete this employee?')) {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.loadEmployees();
          },
          error: (err) => {
            console.error('Error deleting employee', err);
          }
        });
      }
    }




    

  }