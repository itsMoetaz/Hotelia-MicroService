FROM openjdk:17
EXPOSE 8093
ADD "target/API_Gateway-0.0.1-SNAPSHOT.jar" "API_Gateway.jar"
ENTRYPOINT ["java", "-jar","API_Gateway.jar"]