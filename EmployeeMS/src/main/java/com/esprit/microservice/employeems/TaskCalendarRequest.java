package com.esprit.microservice.employeems;

import java.util.List;

public class TaskCalendarRequest {
    private String title;
    private String description;
    private String startDateTime;  // ISO format: "2023-06-03T10:00:00.000Z"
    private String endDateTime;    // ISO format: "2023-06-03T11:00:00.000Z"
    private List<Long> assigneeIds;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStartDateTime() { return startDateTime; }
    public void setStartDateTime(String startDateTime) { this.startDateTime = startDateTime; }

    public String getEndDateTime() { return endDateTime; }
    public void setEndDateTime(String endDateTime) { this.endDateTime = endDateTime; }

    public List<Long> getAssigneeIds() { return assigneeIds; }
    public void setAssigneeIds(List<Long> assigneeIds) { this.assigneeIds = assigneeIds; }
}