# ✈️ Smart Airport Queue Management System

A real-time airport queue management system designed to manage passenger queues across airport services such as **security screening and boarding**.

The system uses a distributed architecture with a **React/TypeScript frontend**, **ASP.NET Core Web API**, **SQL Server**, **Azure Service Bus**, and a **.NET Worker Service** to process queue operations reliably and prevent duplicate ticket processing.

---

## 📌 Overview

Airport queues can become difficult to manage when multiple counters, employees, and passengers interact with the system simultaneously.

This project provides a centralized system for:

* Creating and managing passenger queue tickets
* Assigning tickets to airport service counters
* Processing passengers in queue order
* Updating queue status in real time
* Managing security and boarding queues
* Authenticating users with JWT
* Processing queue events asynchronously
* Preventing duplicate ticket processing when multiple workers operate concurrently

The system was designed with a focus on **backend architecture, concurrency control, asynchronous processing, and cloud deployment**.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────────┐
                    │     React Frontend      │
                    │    TypeScript / Vite    │
                    └────────────┬────────────┘
                                 │
                              HTTP/JWT
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    ASP.NET Core API     │
                    │                         │
                    │ • Authentication        │
                    │ • Queue Management      │
                    │ • Business Logic        │
                    │ • REST APIs             │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
          ┌──────────────────┐      ┌────────────────────┐
          │    SQL Server    │      │  Azure Service Bus │
          │                  │      │                    │
          │ Queue / Users /  │      │ Queue Events       │
          │ Tickets / Status │      │                    │
          └──────────────────┘      └─────────┬──────────┘
                                              │
                                              ▼
                                  ┌────────────────────┐
                                  │  .NET Worker       │
                                  │     Service        │
                                  │                    │
                                  │ Async Processing   │
                                  │ Concurrency        │
                                  │ Control            │
                                  └────────────────────┘
```

### Request Flow

1. A user interacts with the React application.
2. The frontend sends an authenticated HTTP request to the ASP.NET Core API.
3. JWT authentication verifies the user's identity and permissions.
4. The API executes the required business operation.
5. Queue and ticket information is persisted in SQL Server.
6. Queue-related events can be sent through Azure Service Bus.
7. The Worker Service consumes and processes events asynchronously.
8. Concurrency controls ensure that the same ticket is not processed multiple times.

---

## 🛠️ Technologies

### Frontend

* React/ TypeScript/ Vite/ HTML/ CSS

### Backend

* C#/ * ASP.NET Core Web API/ * REST APIs/ * JWT Authentication/ * .NET Worker Service

### Database

* Microsoft SQL Server
* T-SQL

### Messaging & Background Processing

* Azure Service Bus
* .NET Worker Services
* Asynchronous event processing

### Cloud & Deployment

* Microsoft Azure
* Azure App Service
* Azure Static Web Apps
* GitHub Actions
* Docker

### Development Tools

* Git/* GitHub/* Visual Studio / VS Code/* Postman

---

## 📂 Project Structure

```text
AirportQueueSys/
│
├── .github/
│   └── workflows/
│       └── azure-static-web-apps-*.yml
│
├── SmartAirport.API/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── Program.cs
│
├── SmartAirport.Client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
│
├── SmartAirport.Worker/
│   ├── Services/
│   └── ...
│
├── DB.sql
├── SmartAirportSystem.slnx
├── Dockerfile
├── .gitignore
└── LICENSE
```

### `SmartAirport.API`

The main backend responsible for:

* REST API endpoints
* Authentication and authorization
* Queue operations
* Ticket management
* Business logic
* Database communication
* Publishing queue events

### `SmartAirport.Client`

The React/TypeScript frontend providing the user interface for interacting with the airport queue system.

### `SmartAirport.Worker`

A background .NET Worker Service responsible for consuming messages and processing queue-related events asynchronously.

### `DB.sql`

SQL Server database schema and SQL scripts required to create the application's database structure.

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication.

The general authentication flow is:

```text
User
  │
  ▼
Login
  │
  ▼
ASP.NET Core API
  │
  ▼
Credentials Verified
  │
  ▼
JWT Token Generated
  │
  ▼
Frontend Stores Token
  │
  ▼
Authenticated API Requests
```

Protected API endpoints require a valid JWT token before allowing access to authorized operations.

---

## 🔄 Queue Processing

The core functionality revolves around managing airport passenger queues.

A simplified queue lifecycle is:

```text
Passenger
    │
    ▼
Ticket Created
    │
    ▼
Waiting
    │
    ▼
Called
    │
    ▼
Being Processed
    │
    ▼
Completed
```

The system keeps track of ticket and queue states so airport staff can process passengers in an organized manner.

---

## ⚡ Concurrency Control

One of the important technical challenges in the project was preventing the same queue ticket from being processed more than once.

This becomes particularly important when multiple workers or requests attempt to process queue operations concurrently.

The system therefore uses concurrency controls around ticket processing to ensure that:

```text
Worker A ──────┐
               │
               ├──► Ticket #123 ──► Process Once
               │
Worker B ──────┘
```

instead of allowing:

```text
Worker A ──► Ticket #123 ──► Process
Worker B ──► Ticket #123 ──► Process AGAIN ❌
```

This makes the queue processing more reliable in a distributed environment.

---

## 📬 Azure Service Bus

Azure Service Bus is used as the messaging layer between the API and background processing components.

Instead of requiring every operation to be processed synchronously, the API can publish an event/message that can later be consumed by the Worker Service.

```text
ASP.NET Core API
       │
       │ Publish Message
       ▼
Azure Service Bus
       │
       │ Consume Message
       ▼
Worker Service
       │
       ▼
Process Queue Event
```

This approach helps separate the API from background processing and provides a foundation for scalable event-driven processing.

---

## 🗄️ Database

The application uses **SQL Server** for persistent storage.

The database stores information related to:

* Users
* Authentication
* Airport queues
* Tickets
* Queue status
* Service/counter information
* Queue processing data

Database creation scripts are provided in:

```text
DB.sql
```

---

## ☁️ Deployment

The project was deployed using Microsoft Azure.

### Frontend

The React application is configured for deployment using **Azure Static Web Apps**.

### Backend

The ASP.NET Core API is deployed using **Azure App Service**.

### CI/CD

GitHub Actions workflows are included in:

```text
.github/workflows/
```

These workflows automate parts of the deployment process.

---

## 🐳 Docker

A `Dockerfile` is included in the repository to support containerized deployment of the application.

Containerization provides a consistent environment between development and deployment.

---

## ⚙️ Configuration

Environment-specific configuration should be provided through environment variables or deployment configuration.

Sensitive information such as:

* Database connection strings
* JWT secrets
* Azure Service Bus connection strings
* API credentials

should **not** be committed to the repository.

Example configuration concept:

```text
Database Connection String
        │
        ▼
Environment Variable
        │
        ▼
ASP.NET Core API
```

---

## 🚀 Running Locally

### Prerequisites

Install:

* .NET SDK
* Node.js
* npm
* SQL Server
* Git

For Azure messaging functionality, an Azure Service Bus namespace is also required.

---

### 1. Clone the repository

```bash
git clone https://github.com/maryamsul/AirportQueueSys.git
cd AirportQueueSys
```

---

### 2. Set up the database

Open `DB.sql` in SQL Server Management Studio or another SQL Server-compatible tool and execute the script.

---

### 3. Configure the API

Configure the required environment variables or local application settings for:

```text
SQL Server
JWT
Azure Service Bus
```

Do not commit production secrets.

---

### 4. Run the API

```bash
cd SmartAirport.API
dotnet run
```

---

### 5. Run the Worker Service

In another terminal:

```bash
cd SmartAirport.Worker
dotnet run
```

---

### 6. Run the React frontend

```bash
cd SmartAirport.Client
npm install
npm run dev
```

The Vite development server will provide the local frontend URL.

---

## 🧪 API Testing

The backend REST APIs can be tested using tools such as **Postman**.

Typical testing flow:

```text
Login
  │
  ▼
Receive JWT
  │
  ▼
Add JWT to Authorization Header
  │
  ▼
Call Protected Endpoints
  │
  ▼
Verify Queue / Ticket Response
```

---

## 🎯 Key Technical Challenges

### 1. Concurrent Ticket Processing

Ensuring that multiple workers or requests cannot process the same ticket simultaneously.

### 2. Asynchronous Processing

Using Azure Service Bus and Worker Services to move queue-related processing away from the main API request flow.

### 3. Authentication

Implementing JWT-based authentication for protected API endpoints.

### 4. Distributed Architecture

Separating the frontend, API, database, messaging system, and worker into independent components.

### 5. Cloud Deployment

Deploying different parts of the application to Azure and configuring the required environment variables and services.

---

## 📈 Possible Future Improvements

* Real-time queue updates using SignalR
* Advanced airport analytics dashboard
* Queue wait-time prediction
* Automatic counter assignment
* Horizontal scaling of Worker Services
* Distributed tracing and centralized logging
* Redis caching for frequently accessed queue data
* Automated integration and end-to-end tests
* Improved monitoring with Azure Application Insights
* Role-based administration dashboard

---

## 📚 What This Project Demonstrates

This project demonstrates practical experience with:

* **C# and ASP.NET Core**
* **REST API development**
* **React and TypeScript**
* **SQL Server**
* **JWT authentication**
* **Asynchronous programming**
* **Background Worker Services**
* **Azure Service Bus**
* **Concurrency control**
* **Event-driven architecture**
* **Docker**
* **CI/CD with GitHub Actions**
* **Microsoft Azure deployment**
* **Distributed application architecture**

---
