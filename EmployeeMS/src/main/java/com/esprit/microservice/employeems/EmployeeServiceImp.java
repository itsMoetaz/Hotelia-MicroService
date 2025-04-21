package com.esprit.microservice.employeems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImp implements IEmployeeService{
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private ChambreClient chambreClient;
    @Autowired
    private IEmailService emailService;

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @Override
    public Employee addEmployee(Employee e) {
        Employee savedEmployee = employeeRepository.save(e);
        if (e.getPosition() != null) {
            emailService.sendWelcomeEmail(savedEmployee);
        }
        return savedEmployee;    }

    @Override
    public Employee updateEmployee(Employee e) {
        return employeeRepository.save(e);
    }



    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
    public List<Chambre> getAllChambres() {
        return chambreClient.getAllChambres();
    }

    public Chambre getChambreById(long id) {
        return chambreClient.getChambreById(id);
    }
}
