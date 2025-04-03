package com.esprit.microservice.employeems;

public interface IEmailService {
    void sendPositionUpdateEmail(Employee employee, Position oldPosition);
    void sendWelcomeEmail(Employee employee);
}
