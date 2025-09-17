# Use an official Node LTS image
FROM node:20-bullseye

# Install required dependencies for Expo / React Native
RUN apt-get update && apt-get install -y \
  git \
  openssh-client \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

RUN npm install -g expo
RUN npm install -g @expo/ngrok

RUN ls -l
COPY package.json ./
RUN ls -l

RUN npm install

COPY . .

# Expose Expo default ports
EXPOSE 19000 19001 19002

# Run Expo in tunnel mode by default (works better in Docker)
CMD ["expo", "start", "--tunnel"]
