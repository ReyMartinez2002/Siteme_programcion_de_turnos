# Siteme - Shift Scheduling System (v0.1 MVP)

Local/offline shift scheduling system for Panpaya delivery riders.

## Overview

This system helps manage delivery riders and Panpaya branches for scheduling purposes. It's designed to work completely offline on a local Windows machine, with data stored in a local SQLite database.

### Key Features (v0.1)

- **Panpaya Branches Management**: Create, read, update, and delete branch information (code, name, zone, address)
- **Rider Management**: Manage delivery riders (domiciliarios) with full name, active status, and rider type
- **Local/Offline**: All data stored in local SQLite database
- **Responsive UI**: Works on desktop and mobile browsers
- **REST API**: FastAPI backend with automatic API documentation

## Tech Stack

### Backend
- **Python 3.10+** with FastAPI
- **SQLite** for local data storage
- **SQLAlchemy** ORM for database operations
- **Alembic** for database migrations
- **Uvicorn** ASGI server

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **Vite** for build tooling
- **Axios** for API calls

## Project Structure

```
Siteme_programcion_de_turnos/
├── backend/
│   ├── alembic/              # Database migrations
│   │   ├── versions/         # Migration files
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── stores.py
│   │   │   └── riders.py
│   │   ├── models/           # SQLAlchemy models
│   │   │   └── models.py
│   │   ├── schemas/          # Pydantic schemas
│   │   │   └── schemas.py
│   │   ├── services/         # Business logic
│   │   │   └── services.py
│   │   ├── database.py       # Database configuration
│   │   └── main.py           # FastAPI app
│   ├── alembic.ini           # Alembic configuration
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── StoresPage.tsx
│   │   │   └── RidersPage.tsx
│   │   ├── services/         # API service layer
│   │   │   ├── api.ts
│   │   │   ├── storeService.ts
│   │   │   └── riderService.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## Installation and Setup (Windows)

### Prerequisites

1. **Python 3.10 or higher**
   - Download from https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"

2. **Node.js 18 or higher**
   - Download from https://nodejs.org/
   - LTS version recommended

3. **Git** (optional, for version control)
   - Download from https://git-scm.com/download/win

### Backend Setup

1. Open Command Prompt or PowerShell and navigate to the project directory:
   ```cmd
   cd path\to\Siteme_programcion_de_turnos
   ```

2. Navigate to the backend directory:
   ```cmd
   cd backend
   ```

3. Create a Python virtual environment:
   ```cmd
   python -m venv venv
   ```

4. Activate the virtual environment:
   ```cmd
   venv\Scripts\activate
   ```

5. Install dependencies:
   ```cmd
   pip install -r requirements.txt
   ```

6. Run database migrations to create tables:
   ```cmd
   alembic upgrade head
   ```

7. Start the backend server:
   ```cmd
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

   The API will be available at:
   - API: http://localhost:8000
   - Interactive API docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/health

### Frontend Setup

1. Open a **new** Command Prompt or PowerShell window

2. Navigate to the frontend directory:
   ```cmd
   cd path\to\Siteme_programcion_de_turnos\frontend
   ```

3. Install dependencies:
   ```cmd
   npm install
   ```

4. Start the development server:
   ```cmd
   npm run dev
   ```

   The frontend will be available at: http://localhost:3000

## Usage

1. **Start the backend server** (in one terminal):
   ```cmd
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

2. **Start the frontend** (in another terminal):
   ```cmd
   cd frontend
   npm run dev
   ```

3. Open your browser and go to http://localhost:3000

4. Use the application:
   - Navigate using the sidebar menu
   - **Branches**: Add, edit, and delete Panpaya branch locations
   - **Riders**: Manage delivery riders, filter by active status

## API Endpoints

### Health Check
- `GET /health` - Check API health status

### Panpaya Stores
- `GET /api/stores/` - List all stores
- `GET /api/stores/{id}` - Get a specific store
- `POST /api/stores/` - Create a new store
- `PUT /api/stores/{id}` - Update a store
- `DELETE /api/stores/{id}` - Delete a store

### Riders
- `GET /api/riders/` - List all riders (supports `?active_only=true` filter)
- `GET /api/riders/{id}` - Get a specific rider
- `POST /api/riders/` - Create a new rider
- `PUT /api/riders/{id}` - Update a rider
- `DELETE /api/riders/{id}` - Delete a rider

## Database

The SQLite database file (`siteme_shifts.db`) is created automatically in the `backend/` directory when you run the migrations.

### Database Schema

**panpaya_stores table:**
- `id` (Integer, Primary Key)
- `code` (String, Unique, Required) - Store identifier code
- `name` (String, Required) - Store name
- `zone` (String, Optional) - Zone/area
- `address` (String, Optional) - Physical address

**riders table:**
- `id` (Integer, Primary Key)
- `full_name` (String, Required) - Rider's full name
- `active` (Boolean, Required) - Whether the rider is active
- `rider_type` (String, Required) - Type of rider (e.g., PANPAYA, EXTERNO, DISPONIBLE)

### Managing Migrations

To create a new migration after model changes:
```cmd
cd backend
alembic revision --autogenerate -m "description of changes"
alembic upgrade head
```

## Development

### Backend Development

The backend uses FastAPI with hot-reload enabled. Any changes to Python files will automatically restart the server.

To access the interactive API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend Development

The frontend uses Vite with hot module replacement (HMR). Changes to React/TypeScript files will update instantly in the browser.

To build for production:
```cmd
npm run build
```

### Code Quality

Backend:
```cmd
# No linting configured yet for v0.1
```

Frontend:
```cmd
npm run lint
```

## Future Enhancements (Not in v0.1)

The following features are planned for future versions:
- Weekly schedule builder with AM/PM shifts
- Disponibles (reserve riders) status tracking
- Time-off and permissions management
- External dispatch events (WhatsApp integration)
- Excel export functionality
- User authentication and authorization
- Multi-user support

## Troubleshooting

### Backend Issues

**Error: "No module named 'app'"**
- Make sure you're in the `backend` directory
- Make sure the virtual environment is activated

**Error: "Database is locked"**
- Close any other applications accessing the database
- Restart the backend server

**Port 8000 already in use:**
- Change the port: `uvicorn app.main:app --reload --port 8001`
- Update the frontend proxy in `vite.config.ts` accordingly

### Frontend Issues

**Error: "Cannot connect to backend"**
- Ensure the backend server is running on port 8000
- Check browser console for CORS errors

**npm install fails:**
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Try using `npm cache clean --force` first

## Data Backup

Since this is a local/offline system, it's important to backup your data regularly:

1. The database file is located at: `backend/siteme_shifts.db`
2. Copy this file to a backup location periodically
3. To restore, replace the database file with your backup

## License

This project is internal software for managing Panpaya delivery rider schedules.

## Support

For issues or questions, contact the development team.

---

**Version:** 0.1.0 (MVP)  
**Last Updated:** December 27, 2025
