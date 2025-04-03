package com.esprit.microservice.employeems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeRestApi {
    @Autowired
    private IEmployeeService iemployeeService;

    @GetMapping("/allEmployees")
    public List<Employee> getAll() {

        return iemployeeService.getAllEmployees();

    }

    @GetMapping("/employeeDetails/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return iemployeeService.getEmployeeById(id);
    }

    @PostMapping("/addEmployee")
    public Employee addEmployee(@RequestBody Employee employee) {
        return iemployeeService.addEmployee(employee);
    }

    @PutMapping("/updateEmployee/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee updatedEmployee) {
        Employee existingEmployee = iemployeeService.getEmployeeById(id);
        if (existingEmployee == null) {
            return null; // Or throw an exception
        }

        // Only update fields that are not null in the request
        if (updatedEmployee.getFirstName() != null) {
            existingEmployee.setFirstName(updatedEmployee.getFirstName());
        }
        if (updatedEmployee.getLastName() != null) {
            existingEmployee.setLastName(updatedEmployee.getLastName());
        }
        if (updatedEmployee.getEmail() != null) {
            existingEmployee.setEmail(updatedEmployee.getEmail());
        }
        if (updatedEmployee.getPhoneNumber() != null) {
            existingEmployee.setPhoneNumber(updatedEmployee.getPhoneNumber());
        }
        if (updatedEmployee.getPosition() != null) {
            existingEmployee.setPosition(updatedEmployee.getPosition());
        }
        if (updatedEmployee.getAssignedTasks() != null) {
            existingEmployee.setAssignedTasks(updatedEmployee.getAssignedTasks());
        }
        if (updatedEmployee.getStatus() != null) {
            existingEmployee.setStatus(updatedEmployee.getStatus());
        }
        if (updatedEmployee.getPerformanceRating() != null) {
            existingEmployee.setPerformanceRating(updatedEmployee.getPerformanceRating());
        }
        if (updatedEmployee.getAvatar() != null) {
            existingEmployee.setAvatar(updatedEmployee.getAvatar());
        }

        return iemployeeService.updateEmployee(existingEmployee);
    }

    @DeleteMapping("/deleteEmployee/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        iemployeeService.deleteEmployee(id);
    }
}
