# Use official Node LTS image
FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
    git \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ENV EXPO_ROUTER_APP_ROOT=app

RUN npm install -g expo

RUN npm install -g @expo/ngrok

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 19000 19001 19002 8081

CMD ["expo", "start", "--tunnel", "-c"]
