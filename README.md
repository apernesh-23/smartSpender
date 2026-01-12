# SmartSpender – AI-Powered Personal Finance Tracker

A full-stack expense tracking application with AI-powered budget predictions and spending insights.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI/ML Service**: Python Flask with Machine Learning models

## Features

- 📊 Expense tracking and management
- 🤖 AI-powered budget predictions using Linear Regression
- 🔍 Spending pattern analysis using K-means Clustering
- ⚠️ Anomaly detection in spending patterns
- 💡 Personalized saving insights
- 🔐 Secure user authentication
- 📈 Interactive dashboard

## Project Structure

```
smartSpender/
├── backend/          # Express.js API server
├── frontend/         # React frontend application
├── ai-service/       # Python Flask ML service
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### AI Service Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/smartspender
JWT_SECRET=your-secret-key-here
PORT=5000
AI_SERVICE_URL=http://localhost:5001
```

### AI Service (.env)
```
FLASK_APP=app.py
FLASK_ENV=development
PORT=5001
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### AI Insights
- `GET /api/insights/budget-prediction` - Get budget prediction
- `GET /api/insights/spending-patterns` - Get spending pattern analysis
- `GET /api/insights/anomalies` - Detect spending anomalies

## Machine Learning Models

1. **Linear Regression**: Predicts future budget requirements based on historical spending
2. **K-means Clustering**: Analyzes spending patterns and categorizes expenses
3. **Anomaly Detection**: Identifies unusual spending patterns

## License

MIT
