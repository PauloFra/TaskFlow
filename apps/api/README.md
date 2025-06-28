# TaskFlow API

Backend API for the TaskFlow task management application.

## Tech Stack

- Node.js with Express
- TypeScript
- PostgreSQL
- Drizzle ORM

## Docker Setup

### Prerequisites

- Docker and Docker Compose installed on your machine

### Starting the Database

To start the PostgreSQL database and pgAdmin:

```bash
# From the root directory of the project
docker-compose up -d
```

This starts:

- PostgreSQL database on port 5432
- pgAdmin web interface on port 5050

### Database Credentials

- **PostgreSQL**:

  - Host: localhost
  - Port: 5432
  - Username: postgres
  - Password: postgres
  - Database: taskflow

- **pgAdmin**:
  - URL: http://localhost:5050
  - Email: admin@taskflow.com
  - Password: admin

After accessing pgAdmin, add a new server with the following details:

- Name: TaskFlow
- Host: postgres (use this hostname instead of localhost within Docker network)
- Port: 5432
- Username: postgres
- Password: postgres
- Database: taskflow

### Initialize the Database

After starting the Docker services:

```bash
# From the apps/api directory
./init-db.sh
```

This script:

1. Waits for PostgreSQL to be ready
2. Generates Drizzle migration files
3. Applies the migrations to the database

## Getting Started

### Environment Setup

Create a `.env` file in the apps/api directory with the following content:

```
# Server Configuration
PORT=3001

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Database Schema

The application uses the following main entities:

- **Users**: Application users with authentication details
- **Workspaces**: Project workspaces that can contain multiple tasks
- **Workspace Members**: Users belonging to specific workspaces with roles
- **Tasks**: Individual tasks with status, priority, and assignee
- **Comments**: Comments on tasks

## API Endpoints

- `GET /`: API welcome message
- `GET /health`: Health check endpoint to verify API and database status

Additional endpoints for users, workspaces, tasks, and comments will be implemented.
