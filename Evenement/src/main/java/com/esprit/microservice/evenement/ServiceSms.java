package com.esprit.microservice.evenement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class ServiceSms {
    private final SmsSender smsSender;

    @Autowired
    public ServiceSms(@Qualifier("twilio") TwilioSmsSender smsSender) {
        this.smsSender = smsSender;
    }
//service sms avancee
    public void sendSms(SmsRequest smsRequest) {
        smsSender.sendSms(smsRequest);
    }
}
