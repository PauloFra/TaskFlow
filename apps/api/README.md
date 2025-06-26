# TaskFlow API

Backend API for the TaskFlow task management application.

## Tech Stack

- Node.js with Express
- TypeScript
- PostgreSQL
- Drizzle ORM

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Environment Setup

Create a `.env` file in the root directory with the following content:

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

# Generate migration files based on your schema
npm run db:generate

# Push schema changes to the database
npm run db:push
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
