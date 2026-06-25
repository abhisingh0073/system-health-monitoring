# System Health Monitor

A production-inspired system monitoring platform built with Node.js, PostgreSQL, and Next.js.

The system monitors Linux servers by collecting system metrics through a lightweight monitoring agent and displays them on a web dashboard.

---

# Features

* Monitor CPU usage
* Monitor Memory usage
* Monitor Disk usage
* Monitor Server uptime
* Online / Offline detection
* Historical metrics storage
* REST API
* Dashboard (In Progress)

---

# Architecture

```text
Ubuntu Server
      │
      ▼
Monitoring Agent
      │
      ▼
Express Backend API
      │
      ▼
PostgreSQL Database
      │
      ▼
Next.js Dashboard
```

---

# Project Structure

```text
system-health-monitor/

├── agent/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── dashboard/
│
└── README.md
```

---

# Technologies

## Agent

* Node.js
* TypeScript
* Axios

## Backend

* Express.js
* PostgreSQL
* pg
* dotenv

## Dashboard

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

---

# Database Schema

## servers

| Column        | Type      |
| ------------- | --------- |
| id            | UUID      |
| hostname      | VARCHAR   |
| ip_address    | VARCHAR   |
| os_name       | VARCHAR   |
| agent_version | VARCHAR   |
| status        | VARCHAR   |
| last_seen     | TIMESTAMP |
| created_at    | TIMESTAMP |
| updated_at    | TIMESTAMP |

---

## metrics

| Column         | Type      |
| -------------- | --------- |
| id             | BIGINT    |
| server_id      | UUID      |
| cpu_usage      | NUMERIC   |
| memory_usage   | NUMERIC   |
| disk_usage     | NUMERIC   |
| network_in     | BIGINT    |
| network_out    | BIGINT    |
| uptime_seconds | BIGINT    |
| created_at     | TIMESTAMP |

---

## services

Stores monitored Linux services.

---

## alerts

Stores generated alerts.

---

## users

Stores dashboard users.

---

# API Endpoints

## Server

POST /api/servers/register

Registers a new monitoring agent.

---

GET /api/servers

Returns all registered servers.

---

GET /api/servers/:id

Returns server details.

---

GET /api/servers/:id/metrics

Returns historical metrics.

---

## Metrics

POST /api/metrics

Stores collected metrics from the monitoring agent.

---

# Agent Workflow

```text
Start Agent
      │
      ▼
Register Server
      │
      ▼
Collect Metrics
      │
      ▼
POST /metrics
      │
      ▼
Sleep 30 Seconds
      │
      ▼
Repeat
```

---

# Offline Detection

Every minute the backend executes a background job.

If

last_seen < NOW() - INTERVAL '2 minutes'

the server status is updated to:

offline

Otherwise the server remains:

online

---

# Environment Variables

## Agent

```env
API_BASE_URL=
METRIC_INTERVAL_SECONDS=
```

## Backend

```env
PORT=

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

OFFLINE_THRESHOLD_MINUTES=
```

---

# Running the Project

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Agent

```bash
cd agent
npm install
npm run dev
```

---

# Current Version

Version: V1

Completed

* Server Registration
* Metrics Collection
* Metrics Storage
* Heartbeat System
* Offline Detection
* REST APIs

Upcoming

* Dashboard
* Charts
* Alerts
* Authentication
* Docker Deployment
* Service Monitoring

---

# License

MIT
