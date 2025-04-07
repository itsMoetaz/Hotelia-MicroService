package com.hotel.ms.gestionhotel.gestionServices.payment;

public class CreatePaymentRequest {
    private int serviceId;
    private double amount;

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
