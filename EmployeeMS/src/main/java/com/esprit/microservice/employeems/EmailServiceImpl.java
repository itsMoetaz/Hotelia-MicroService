package com.esprit.microservice.employeems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements IEmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendPositionUpdateEmail(Employee employee, Position oldPosition) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(employee.getEmail());
            message.setSubject("Your Position Has Been Updated");
            message.setText("Dear " + employee.getFirstName() + " " + employee.getLastName() + ",\n\n" +
                    "This is to inform you that your position has been updated from " +
                    oldPosition + " to " + employee.getPosition() + ".\n\n" +
                    "Regards,\nHR Department");
            emailSender.send(message);
            System.out.println("Position update email successfully sent to: " + employee.getEmail());
        } catch (Exception e) {
            System.err.println("Error sending position update email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void sendWelcomeEmail(Employee employee) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(employee.getEmail());
        message.setSubject("Welcome to Our Company");
        message.setText("Dear " + employee.getFirstName() + " " + employee.getLastName() + ",\n\n" +
                "Welcome to our company! You have been assigned the position of " +
                employee.getPosition() + ".\n\n" +
                "Regards,\nHR Department");
        emailSender.send(message);
    }
}