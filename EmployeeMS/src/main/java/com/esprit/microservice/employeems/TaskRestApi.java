package com.esprit.microservice.employeems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/task")
public class TaskRestApi {

    @Autowired
    private CalendarService calendarService;

    // Your existing task endpoints...

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
}