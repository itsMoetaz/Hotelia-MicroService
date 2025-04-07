package com.esprit.microservice.evenement;

public interface SmsSender {
    void sendSms (SmsRequest smsRequest);
     boolean isPhoneNumberValid(String phoneNumber);
}
