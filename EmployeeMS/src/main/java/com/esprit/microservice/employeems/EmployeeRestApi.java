package com.esprit.microservice.employeems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employees")
public class EmployeeRestApi {
    @Autowired
    private IEmployeeService iemployeeService;
    @Autowired
    private IEmailService emailService;

    @Autowired
    private ExportServiceImp exportServiceImp;
    @Autowired
    private CalendarService calendarService;

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

        Position oldPosition = existingEmployee.getPosition(); // 🔥 Save BEFORE modifying
        Position newPosition = updatedEmployee.getPosition();

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
        if (newPosition != null) {
            existingEmployee.setPosition(newPosition);
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

        // Compare old vs. new positions BEFORE saving
        boolean positionChanged = oldPosition != null && newPosition != null && !oldPosition.equals(newPosition);
        System.out.println("Old position: " + oldPosition);
        System.out.println("New position: " + newPosition);
        System.out.println("Changed? " + positionChanged);

        Employee saved = iemployeeService.updateEmployee(existingEmployee);

        if (positionChanged) {
            System.out.println("Sending position change email...");
            emailService.sendPositionUpdateEmail(saved, oldPosition);
        }

        return saved;

    }
    @GetMapping("/export/pdf")
    public ResponseEntity<Resource> exportEmployeesPDF() {
        try {
            ByteArrayResource resource = exportServiceImp.exportEmployeesToPDF();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=employees.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(resource.contentLength())
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }

    }
    @PostMapping("/{id}/calendar-invite")
    public ResponseEntity<?> sendCalendarInvite(
            @PathVariable Long id,
            @RequestBody TaskCalendarRequest request) {
        try {
            String eventLink = calendarService.createTaskEvent(
                    id,
                    request.getTitle(),
                    request.getDescription(),
                    request.getStartDateTime(),
                    request.getEndDateTime(),
                    request.getAssigneeIds()
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Calendar invite sent successfully",
                    "eventLink", eventLink
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Failed to send calendar invite: " + e.getMessage()
            ));
        }
    }
    @DeleteMapping("/deleteEmployee/{id}")
    public void deleteEmployee(@PathVariable Long id) {
        iemployeeService.deleteEmployee(id);
    }
}
