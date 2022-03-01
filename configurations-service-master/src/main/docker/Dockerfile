FROM adoptopenjdk/openjdk8-openj9 AS TEMP_BUILD_IMAGE
ENV APP_HOME=/usr/app/
RUN mkdir -p $APP_HOME/src/main/java
WORKDIR $APP_HOME
COPY build.gradle settings.gradle gradlew gradlew.bat $APP_HOME
COPY gradle $APP_HOME/gradle
RUN ./gradlew build -x test || return 0
COPY . .
RUN ./gradlew build -x test

FROM adoptopenjdk/openjdk8-openj9
MAINTAINER Sycom Africa "info@sycomafrica.com"
ENV ARTIFACT_NAME=configurations-service-1.0.0-RELEASE.jar
ENV APP_HOME=/usr/app/
ENV SYHOS_PROFILE=gcloud-dev
ENV DISCOVERY_SERVICE localhost
WORKDIR $APP_HOME
COPY --from=TEMP_BUILD_IMAGE /usr/app/build/libs/$ARTIFACT_NAME app.jar
EXPOSE 8888
ENTRYPOINT ["java","-Xms128m","-Xmx256m","-Djava.security.egd=file:/dev/./urandom","-jar","-Dspring.profiles.active=${SYHOS_PROFILE}","-Deureka.client.serviceUrl.defaultZone=http://${DISCOVERY_SERVICE}:8761/eureka/","/app.jar"]
