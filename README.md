# AI Chatbot with Express.js and FastAPI

This project implements a stateless chatbot system using Express.js backend that communicates with a FastAPI microservice for handling chatbot logic. The system uses OpenAI's GPT model for response generation, Redis for session management, and PostgreSQL for persistent storage.

## Architecture

- **Express Backend (Node.js)**

  - Handles HTTP requests
  - Routes requests to FastAPI service
  - Implements stateless design for scalability

- **FastAPI Microservice (Python)**
  - Manages chatbot logic
  - Integrates with OpenAI API
  - Handles session management via Redis
  - Persists chat history to PostgreSQL

## Prerequisites

- Node.js (v18 or higher)
- Python 3.11 or higher
- Docker and Docker Compose
- Redis
- PostgreSQL

## Setup Instructions

### Express Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file from template:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run server
   ```

### FastAPI Setup

#### Unix/Linux/MacOS

1. Navigate to FastAPI directory:

   ```bash
   cd fastapi
   ```

2. Create and activate virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Upgrade pip:

   ```bash
   python -m pip install --upgrade pip
   ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Create `.env` file from template:

   ```bash
   cp .env.example .env
   ```

6. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Windows

1. Navigate to FastAPI directory:

   ```powershell
   cd .\fastapi
   ```

2. Create and activate virtual environment:

   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Upgrade pip:

   ```powershell
   python -m pip install --upgrade pip
   ```

4. Install dependencies:

   ```powershell
   pip install -r requirements.txt
   ```

5. Create `.env` file from template:

   ```powershell
   copy .env.example .env
   ```

6. Start the development server:
   ```powershell
   uvicorn app.main:app --reload
   ```

## Docker Setup

Run the entire stack using Docker Compose:

```bash
docker-compose up
```

This will start:

- Express backend on port 5000
- FastAPI service on port 8000

## Environment Variables

### Backend (.env)

- `PORT`: Express server port (default: 3000)
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL_NAME`: OpenAI model name
- Redis and PostgreSQL connection details

### FastAPI (.env)

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL_NAME`: OpenAI model name
- Redis and PostgreSQL connection details

## API Endpoints

### Express Backend

- POST `/api/chat`: Process chat messages
- POST `/api/chat/save`: Save chat session

### FastAPI

- POST `/api/chat`: Process chat messages
- POST `/api/chat/save`: Save chat session
- Swagger UI: `http://localhost:8000/docs`

## Development

- Express backend runs in watch mode using `--watch` flag
- FastAPI uses uvicorn with `--reload` for hot reloading
- Docker Compose mounts volumes for live code updates

## Database Migrations

Run database migrations using Knex:

```bash
cd backend
npm run migrate:latest
```
