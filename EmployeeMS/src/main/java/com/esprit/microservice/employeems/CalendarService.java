package com.esprit.microservice.employeems;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class CalendarService {

    private static final String APPLICATION_NAME = "Employee Task Calendar";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";
    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);
    private static final String CREDENTIALS_FILE_PATH = "/credentials.json";

    @Autowired
    private IEmployeeService employeeService;

    private Calendar getCalendarService() throws IOException, GeneralSecurityException {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    private Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT) throws IOException {
        InputStream in = CalendarService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();

        // This handles the entire authorization flow automatically
        LocalServerReceiver receiver = new LocalServerReceiver.Builder()
                .setPort(8888)
                .setCallbackPath("/Callback")
                .build();

        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }    public String createTaskEvent(Long taskId, String title, String description,
                                 String startDateTime, String endDateTime,
                                 List<Long> assigneeIds) throws IOException, GeneralSecurityException {

        Calendar service = getCalendarService();

        Event event = new Event()
                .setSummary(title)
                .setDescription(description);

        DateTime startTime = new DateTime(startDateTime);
        EventDateTime start = new EventDateTime()
                .setDateTime(startTime)
                .setTimeZone("UTC");
        event.setStart(start);

        DateTime endTime = new DateTime(endDateTime);
        EventDateTime end = new EventDateTime()
                .setDateTime(endTime)
                .setTimeZone("UTC");
        event.setEnd(end);

        // Add attendees
        if (assigneeIds != null && !assigneeIds.isEmpty()) {
            List<EventAttendee> attendees = assigneeIds.stream()
                    .map(id -> {
                        Employee employee = employeeService.getEmployeeById(id);
                        return new EventAttendee()
                                .setEmail(employee.getEmail())
                                .setDisplayName(employee.getFirstName() + " " + employee.getLastName());
                    })
                    .toList();

            event.setAttendees(attendees);
        }

        // Add reminders
        Event.Reminders reminders = new Event.Reminders()
                .setUseDefault(false)
                .setOverrides(Arrays.asList(
                        new EventReminder().setMethod("email").setMinutes(24 * 60), // 1 day before
                        new EventReminder().setMethod("popup").setMinutes(30) // 30 min before
                ));
        event.setReminders(reminders);

        // Task metadata
        event.setSource(new Event.Source()
                .setTitle("Employee Management System")
                .setUrl("http://localhost:8082/task/" + taskId));

        // Insert and send invites
        event = service.events().insert("primary", event)
                .setSendNotifications(true)
                .execute();

        return event.getHtmlLink();
    }
}