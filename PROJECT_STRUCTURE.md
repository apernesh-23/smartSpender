# SmartSpender Project Structure

## Overview

SmartSpender is a full-stack MERN application with an integrated Python Flask AI service for intelligent financial insights.

## Directory Structure

```
smartSpender/
│
├── backend/                    # Express.js + MongoDB Backend
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User model with password hashing
│   │   └── Expense.js         # Expense model with categories
│   ├── routes/
│   │   ├── auth.js            # Authentication routes (register/login)
│   │   ├── expenses.js        # CRUD operations for expenses
│   │   └── insights.js        # AI insights endpoints (proxies to AI service)
│   ├── server.js              # Express server setup
│   └── package.json           # Backend dependencies
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.css       # Auth page styles
│   │   │   ├── Dashboard.js   # Main dashboard with charts
│   │   │   ├── Dashboard.css
│   │   │   ├── ExpenseForm.js # Add expense form
│   │   │   ├── ExpenseForm.css
│   │   │   ├── ExpenseList.js # List of expenses
│   │   │   ├── ExpenseList.css
│   │   │   ├── ExpensesPage.js # Wrapper for form + list
│   │   │   ├── Insights.js    # AI insights display
│   │   │   ├── Insights.css
│   │   │   ├── Login.js       # Login component
│   │   │   ├── Navbar.js      # Navigation bar
│   │   │   ├── Navbar.css
│   │   │   └── Register.js    # Registration component
│   │   ├── utils/
│   │   │   ├── api.js         # Axios instance with auth
│   │   │   └── auth.js        # Auth token management
│   │   ├── App.js             # Main app component with routing
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   └── package.json           # Frontend dependencies
│
├── ai-service/                 # Python Flask AI Service
│   ├── app.py                 # Flask app with ML endpoints
│   └── requirements.txt       # Python dependencies
│
├── README.md                   # Main project documentation
├── SETUP.md                    # Detailed setup instructions
├── PROJECT_STRUCTURE.md        # This file
└── .gitignore                  # Git ignore rules

```

## Technology Stack

### Backend
- **Express.js**: Web framework
- **MongoDB**: Database (via Mongoose)
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **axios**: HTTP client for AI service communication

### Frontend
- **React**: UI framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **date-fns**: Date formatting

### AI Service
- **Flask**: Python web framework
- **scikit-learn**: Machine learning library
  - Linear Regression
  - K-means Clustering
- **pandas**: Data manipulation
- **numpy**: Numerical computing

## Key Features

### 1. User Authentication
- Secure registration and login
- JWT token-based authentication
- Password hashing with bcrypt

### 2. Expense Management
- Add, view, update, delete expenses
- Categorize expenses (Food, Transport, Shopping, etc.)
- Date tracking
- Description field

### 3. Dashboard
- Total expenses overview
- Category-wise breakdown (Pie chart)
- Monthly trends (Bar chart)
- Statistics cards

### 4. AI-Powered Insights

#### Budget Prediction (Linear Regression)
- Predicts future monthly budget based on historical data
- Uses time-series analysis
- Provides confidence scores

#### Spending Patterns (K-means Clustering)
- Groups expenses into spending patterns
- Category-based analysis
- Average spending per category

#### Anomaly Detection
- Statistical outlier detection (Z-score)
- Category-based anomaly detection
- Identifies unusual spending patterns

## API Flow

```
Frontend (React) 
    ↓ HTTP Requests
Backend (Express.js)
    ↓ MongoDB Queries
MongoDB Database
    ↓ Expense Data
Backend (Express.js)
    ↓ HTTP Requests
AI Service (Flask)
    ↓ ML Processing
Backend (Express.js)
    ↓ JSON Response
Frontend (React)
```

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcrypt with salt rounds
3. **Input Validation**: express-validator for all inputs
4. **CORS Configuration**: Controlled cross-origin requests
5. **Environment Variables**: Sensitive data in .env files
6. **User Isolation**: Users can only access their own expenses

## Machine Learning Models

### Linear Regression Model
- **Purpose**: Predict future monthly budget
- **Features**: Month index (time series)
- **Output**: Predicted monthly budget amount
- **Confidence**: R² score

### K-means Clustering
- **Purpose**: Identify spending patterns
- **Features**: Amount, Category (encoded)
- **Output**: Clustered expense groups
- **Use Case**: Understanding spending behavior

### Anomaly Detection
- **Method 1**: Statistical (Z-score > 2.5σ)
- **Method 2**: Category-based (amount > mean + 2σ for category)
- **Output**: List of anomalous expenses with reasons

## Development Workflow

1. Start MongoDB (local or Atlas)
2. Start Backend server (port 5000)
3. Start AI Service (port 5001)
4. Start Frontend dev server (port 3000)
5. Access application at http://localhost:3000

## Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port
- `AI_SERVICE_URL`: AI service endpoint

### AI Service (.env - optional)
- `FLASK_APP`: Flask application file
- `FLASK_ENV`: Environment (development/production)
- `PORT`: Flask server port

## Data Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- timestamps

### Expense
- userId: ObjectId (reference to User)
- amount: Number
- category: String (enum)
- description: String
- date: Date
- timestamps

## Future Enhancements

- Budget limits and alerts
- Recurring expense tracking
- Export to CSV/PDF
- Email notifications
- Mobile app (React Native)
- Advanced ML models (LSTM for time series)
- Multi-currency support
- Expense sharing/groups
