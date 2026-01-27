FROM gradle:8-jdk17 AS builder

LABEL author="Soft Uzbek Slogan"

WORKDIR /app

COPY . .

RUN gradle bootJar --no-daemon -x test

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]