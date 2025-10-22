FROM node:20.19.4

# Installer JDK et outils Android
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

ENV ANDROID_SDK_ROOT=/opt/android-sdk
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    cd $ANDROID_SDK_ROOT/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip && \
    unzip cmdline-tools.zip && \
    mv cmdline-tools latest && \
    rm cmdline-tools.zip

ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools
RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "cmdline-tools;latest"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install


COPY android /usr/src/app/android
COPY . .

# Build APK avec Gradle
WORKDIR /usr/src/app/android
RUN chmod +x gradlew
RUN ./gradlew assembleRelease

# Copier l’APK dans le volume partagé
RUN mkdir -p /shared && cp app/build/outputs/apk/release/app-release.apk /shared/client.apk

EXPOSE 19000 19001 19002 8081

CMD ["tail", "-f", "/dev/null"]