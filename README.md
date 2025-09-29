# AREA

Our app makes automation easy and effortless. In just a few clicks, connect your APIs and 
build smart workflows that run on their own. No more repetitive tasks—save time, stay 
focused on what matters, and let our platform do the work for you. The perfect tool for 
busy people who want to achieve more with less effort.

---

## Features

- REST API server
- Docker-based local development
- OAuth (GitHub)
- Secrets and API keys via environment variables
- MariaDB database support

---

## Requirements

Make sure you have:

- **Docker** → https://docs.docker.com/get-docker/
- **Docker Compose** (comes with Docker Desktop)
- **Git** (if cloning via repository)

---

## Getting Started (Local Development)

### 1 Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <project-folder>
```

### 2 Create your .env.local
Copy the example file:
```bash
cp .env.local.example .env.local
```

Then fill in your credentials in .env.local:
You can find how to generate the required API keys here:
- Nasa -> https://api.nasa.gov/
- Discord -> https://discord.com/developers/applications 
- OpenWheather -> https://home.openweathermap.org/api_keys

### 3 Start the Project
To run locally:
```bash
docker compose up --build
```

To run in detached mode:
```bash
docker compose up --build -d
```

To stop everything:
```bash
docker compose down
```

### API documentation
Api documentation can be found on the http://localhost:8080
