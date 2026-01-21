from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import stores_router, riders_router, brands_router, schedules_router, imports_router

app = FastAPI(
    title="Siteme - Shift Scheduling System",
    description="Local/offline shift scheduling system for Panpaya delivery riders",
    version="0.1.0",
)

# Configure CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stores_router, prefix="/api")
app.include_router(riders_router, prefix="/api")
app.include_router(brands_router, prefix="/api")
app.include_router(schedules_router, prefix="/api")
app.include_router(imports_router, prefix="/api")


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "0.1.0"}


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Siteme Shift Scheduling API",
        "version": "0.1.0",
        "docs": "/docs",
    }
