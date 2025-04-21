import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  editMode: boolean = false;
selectedEmployee: Employee | null = null;
  // Employee form related properties
  employeeForm!: FormGroup;
  submitted = false;
  formError: string | null = null;
  
  constructor(
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder
  ) { }
  
  ngOnInit(): void {
    this.loadEmployees();
    this.initForm();
  }

  // Initialize the employee form
  initForm(): void {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      position: ['', Validators.required],
      status: ['ACTIVE'],
      performanceRating: [7, [Validators.min(1), Validators.max(10)]]
    });
  }

  // Convenience getter for easy form field access
  get f() { return this.employeeForm.controls; }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;
    
    this.employeeService.getEmployees(this.currentPage, this.pageSize)
    .subscribe({
      next: (response) => {
        // Normalize IDs: ensure all employees have an id field
        const normalizedEmployees = (response.content || []).map(emp => {
          // Create a new object to avoid modifying the original
          const normalizedEmp = {...emp};
          
          // If no ID but has _id, use _id as id
          if (!normalizedEmp.id && normalizedEmp._id) {
            normalizedEmp.id = normalizedEmp._id;
          }
          else if (!normalizedEmp.id && normalizedEmp._links?.self?.href) {
            const hrefParts = normalizedEmp._links.self.href.split('/');
            normalizedEmp.id = hrefParts[hrefParts.length - 1];
          }
          
          return normalizedEmp;
        });
        
        console.log('Normalized employees:', normalizedEmployees);
        this.employees = normalizedEmployees;
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
  editEmployee(employee: Employee): void {
    console.log('Editing employee:', employee);
    
    // Create a deep copy
    const employeeCopy = {...employee};
    
    // Check all possible ID sources
    if (!employeeCopy.id) {
      // Try _id first
      if (employeeCopy._id) {
        employeeCopy.id = employeeCopy._id;
        console.log('Using _id as id:', employeeCopy.id);
      } 
          // Try links.self.href if available
    else if (employeeCopy._links && employeeCopy._links.self && employeeCopy._links.self.href) {
      // Extract ID from URL, assuming format like ".../employees/123"
      const hrefParts = employeeCopy._links.self.href.split('/');
      employeeCopy.id = hrefParts[hrefParts.length - 1];
      console.log('Extracted ID from HATEOAS link:', employeeCopy.id);
    }
      // Try links.self.href if available

    }
    
    if (!employeeCopy.id) {
      console.error('Error: Cannot edit employee without ID', employee);
      alert('Cannot edit this employee: missing ID');
      return;
    }
    
    this.editMode = true;
    this.selectedEmployee = employeeCopy;
    this.formError = null;
    
    // Rest of your function remains unchanged
    this.employeeForm.patchValue({
      firstName: employeeCopy.firstName || '',
      lastName: employeeCopy.lastName || '',
      email: employeeCopy.email || '',
      phoneNumber: employeeCopy.phoneNumber || '',
      position: employeeCopy.position || '',
      status: employeeCopy.status || 'ACTIVE',
      performanceRating: employeeCopy.performanceRating || 7
    });
    
    this.submitted = false;
    
    // Open modal
    const modal = document.getElementById('add_employee_modal') as HTMLDialogElement;
    modal.showModal();
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
  
  // Open the add employee modal
  addEmployee(): void {
    this.editMode = false;
    this.selectedEmployee = null;
    // Reset form before opening
    this.employeeForm.reset({
      status: 'ACTIVE',
      performanceRating: 7
    });
    this.submitted = false;
    this.formError = null;
    
    // Open modal
    const modal = document.getElementById('add_employee_modal') as HTMLDialogElement;
    modal.showModal();
  }
  
  // Close the add employee modal
  closeAddEmployeeModal(): void {
    const modal = document.getElementById('add_employee_modal') as HTMLDialogElement;
    modal.close();
  }
  
// Submit the employee form
submitEmployee(): void {
  this.submitted = true;
  this.formError = null;
  
  // Stop if form is invalid
  if (this.employeeForm.invalid) {
    return;
  }
  
  this.loading = true;
  
  // Create the employee data from form values
  const employeeData: Partial<Employee> = {
    firstName: this.f['firstName'].value,
    lastName: this.f['lastName'].value,
    email: this.f['email'].value,
    phoneNumber: this.f['phoneNumber'].value,
    position: this.f['position'].value,
    status: 'ACTIVE', // Default to active if not in form
    performanceRating: this.f['performanceRating'].value
  };
  
  // Check if we're editing or adding
  if (this.editMode && this.selectedEmployee) {
    // Make sure we have a valid ID
    const employeeId = this.selectedEmployee.id || this.selectedEmployee._id;
    
    console.log('Updating employee with ID:', employeeId);
    
    if (!employeeId) {
      this.loading = false;
      this.formError = 'Cannot update: Employee ID is missing';
      console.error('Update failed: No ID available', this.selectedEmployee);
      return;
    }
    
    // Make sure we include the ID from the selectedEmployee
    const updatedEmployee: Employee = {
      id: employeeId,
      _id: employeeId, // Include both ID formats to be safe
      ...employeeData
    };
    
    this.employeeService.updateEmployee(updatedEmployee)
      .subscribe({
        next: () => {
          this.loading = false;
          this.closeAddEmployeeModal();
          this.loadEmployees();
        },
        error: (err) => {
          this.loading = false;
          console.error('Error updating employee', err);
          this.formError = err.error?.message || 'Failed to update employee. Please try again.';
        }
      });
  } else {
    // Add new employee
    this.employeeService.addEmployee(employeeData)
      .subscribe({
        next: () => {
          this.loading = false;
          this.closeAddEmployeeModal();
          this.loadEmployees();
        },
        error: (err) => {
          this.loading = false;
          console.error('Error adding employee', err);
          this.formError = err.error?.message || 'Failed to add employee. Please try again.';
        }
      });
  }
}
  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      this.loading = true;
      
      this.employeeService.deleteEmployee(id)
        .subscribe({
          next: () => {
            this.loading = false;
            this.loadEmployees();
          },
          error: (err) => {
            this.loading = false;
            console.error('Error deleting employee', err);
            // Show error message (you could add a toast notification here)
            alert('Failed to delete employee. Please try again.');
          }
        });
    }}
}