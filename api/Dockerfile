FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM mcr.microsoft.com/playwright:v1.41.0-jammy

RUN apt-get update && \
    apt-get install -y openjdk-21-jre && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 80
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8000"]