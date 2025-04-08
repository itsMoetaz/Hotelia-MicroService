package com.esprit.microservice.evenement;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;

import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("twilio")
public class TwilioSmsSender implements SmsSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(TwilioSmsSender.class);

    private final TwilioConfiguration twilioConfiguration;

    @Autowired
    public TwilioSmsSender(TwilioConfiguration twilioConfiguration) {
        this.twilioConfiguration = twilioConfiguration;
    }
//ersonnalise
    @Override
    public void sendSms(SmsRequest smsRequest) {
        if (isPhoneNumberValid(smsRequest.getPhoneNumber())) {
            PhoneNumber to = new PhoneNumber(smsRequest.getPhoneNumber());
            PhoneNumber from = new PhoneNumber(twilioConfiguration.getTrialNumber());
            String message = smsRequest.getMessage();
            MessageCreator creator = Message.creator(to, from, message);
            try {
                creator.create();
                LOGGER.info("SMS sent successfully to {}", smsRequest.getPhoneNumber());
            } catch (com.twilio.exception.ApiException e) {
                LOGGER.error("Twilio API Exception: {}", e.getMessage());
                throw new RuntimeException("Failed to send SMS due to authentication or API error.", e);
            }

        } else {
            throw new IllegalArgumentException(
                    "Phone number [" + smsRequest.getPhoneNumber() + "] is not a valid number"
            );
        }
    }


    /** envoyer message pour number emplayee **/
    public void sendSmsAdd(String to, String message) {
        Message.creator(
                new PhoneNumber(to),
                new PhoneNumber(twilioConfiguration.getTrialNumber()),
                message
        ).create();
    }

    private boolean isPhoneNumberValid(String phoneNumber) {
        // TODO: Implement phone number validator
        return true;
    }}