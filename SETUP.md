# SmartSpender Setup Guide

This guide will help you set up and run the SmartSpender application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/downloads/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)

## Step-by-Step Setup

### 1. Clone or Navigate to Project Directory

```bash
cd smartSpender
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# On Windows PowerShell:
Copy-Item .env.example .env
# On Linux/Mac:
# cp .env.example .env

# Edit .env file with your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A random secret key for JWT tokens
# - PORT: Backend server port (default: 5000)
# - AI_SERVICE_URL: URL of the AI service (default: http://localhost:5001)
```

**Example .env file:**
```
MONGODB_URI=mongodb://localhost:27017/smartspender
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
AI_SERVICE_URL=http://localhost:5001
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartspender?retryWrites=true&w=majority
```

### 3. AI Service Setup

```bash
# Navigate to ai-service directory
cd ../ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Windows CMD:
# venv\Scripts\activate.bat
# On Linux/Mac:
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment file (optional)
# The service will use default values if .env is not present
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file if you need to customize API URL (optional)
# REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Start the Services

You'll need to run three services simultaneously. Open three terminal windows:

#### Terminal 1 - MongoDB (if using local MongoDB)
```bash
# Start MongoDB service
# On Windows (if installed as service, it may already be running):
# Check Services or run: net start MongoDB

# On Linux/Mac:
# mongod
```

#### Terminal 2 - Backend Server
```bash
cd backend
npm start
# or for development with auto-reload:
# npm run dev
```

#### Terminal 3 - AI Service
```bash
cd ai-service
# Make sure virtual environment is activated
python app.py
```

#### Terminal 4 - Frontend (Development Server)
```bash
cd frontend
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

## Verification

1. **Backend Health Check**: Visit `http://localhost:5000/api/health`
   - Should return: `{"status":"OK","message":"SmartSpender API is running"}`

2. **AI Service Health Check**: Visit `http://localhost:5001/health`
   - Should return: `{"status":"OK","message":"AI Service is running"}`

3. **Frontend**: Visit `http://localhost:3000`
   - Should show the login/register page

## First Time Usage

1. Register a new account at `http://localhost:3000/register`
2. Login with your credentials
3. Add some expenses to get started
4. View AI insights after adding at least 5 expenses

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local instance)
- Check your connection string in `.env`
- For Atlas, ensure your IP is whitelisted

### Port Already in Use
- Backend (5000): Change `PORT` in `backend/.env`
- AI Service (5001): Change `PORT` in `ai-service/.env` or environment
- Frontend (3000): React will prompt to use a different port

### Python/Flask Issues
- Ensure virtual environment is activated
- Check Python version: `python --version` (should be 3.8+)
- Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`

### CORS Errors
- Ensure backend CORS is configured correctly
- Check that AI_SERVICE_URL matches the actual AI service URL

### AI Service Not Responding
- Check if Flask app is running on correct port
- Verify all Python dependencies are installed
- Check Flask logs for errors

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend
2. Build frontend: `cd frontend && npm run build`
3. Use a process manager like PM2 for Node.js services
4. Use Gunicorn or similar for Flask app
5. Configure proper environment variables
6. Use HTTPS
7. Set strong JWT_SECRET
8. Configure MongoDB with authentication

## Support

For issues or questions, check the main README.md file or create an issue in the repository.
