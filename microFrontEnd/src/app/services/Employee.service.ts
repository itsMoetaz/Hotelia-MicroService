import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Employee } from '../models/Employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/employees'; // Adjust to your Spring Boot endpoint

  constructor(private http: HttpClient) { }

  getEmployees(page: number = 0, size: number = 10): Observable<{content: Employee[], totalElements: number}> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      return this.http.get<any>(`${this.apiUrl}`, { params })
      .pipe(
        retry(1),
        map(response => {
          console.log('API Response:', response);
          if (response && response._embedded && response._embedded.employees) {
            return {
              content: response._embedded.employees,
              totalElements: response.page.totalElements || response._embedded.employees.length,
              totalPages: response.page.totalPages || 1,
              number: response.page.number || 0,
              size: response.page.size || response._embedded.employees.length
            };
          }
          // Handle array response format (direct array of employees)
          if (Array.isArray(response)) {
            return {
              content: response,
              totalElements: response.length
            };
          }
          
          // Handle paginated response format (content and totalElements properties)
          if (response && response.content && Array.isArray(response.content)) {
            return response;
          }
          
          // Handle unexpected response format
          console.error('Unexpected API response format:', response);
          return {
            content: [],
            totalElements: 0
          };
        }),
        catchError(this.handleError<{content: Employee[], totalElements: number}>('getEmployees', {
          content: [],
          totalElements: 0
        }))
      );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Employee>(`getEmployeeById id=${id}`))
      );
  }

  addEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee)
      .pipe(
        catchError(this.handleError<Employee>('addEmployee'))
      );
  }

// Replace the updateEmployee method with this improved version
updateEmployee(employee: Employee): Observable<Employee> {
  const employeeId = employee.id || employee._id;

  if (!employeeId) {
    console.error('Cannot update employee without an ID');
    return throwError(() => new Error('Employee ID is required for updates'));
  }
  
  return this.http.put<Employee>(`${this.apiUrl}/${employeeId}`, employee)
    .pipe(
      retry(1),
      catchError(this.handleError<Employee>('updateEmployee'))
    );
}

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<void>('deleteEmployee'))
      );
  }

//   getEmployeeStats(): Observable<EmployeeStats> {
//     return this.http.get<EmployeeStats>(`${this.apiUrl}/stats`)
//       .pipe(
//         catchError(this.handleError<EmployeeStats>('getEmployeeStats', {
//           total: 0,
//           onDuty: 0,
//           pendingTimeOff: 0,
//           avgPerformance: 0,
//           departmentDistribution: []
//         }))
//       );
//   }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      console.error('Server error:', error);

      // Return empty result to keep app running
      return of(result as T);
    };
  }
}