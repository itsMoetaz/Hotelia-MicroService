package com.esprit.microservice.employeems;

import java.util.List;

public interface IEmployeeService {
    public List<Employee> getAllEmployees();
    public Employee getEmployeeById(Long id);
    public Employee addEmployee(Employee e);
    public Employee updateEmployee(Employee e);
    public void deleteEmployee(Long id);
     List<Chambre> getAllChambres();
    Chambre getChambreById(long id);
}
