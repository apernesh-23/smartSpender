from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'message': 'AI Service is running'})

@app.route('/predict-budget', methods=['POST'])
def predict_budget():
    """
    Predict future monthly budget using Linear Regression
    """
    try:
        data = request.json
        expenses = data.get('expenses', [])
        
        if len(expenses) < 3:
            return jsonify({
                'prediction': None,
                'message': 'Need at least 3 expenses for prediction'
            }), 400
        
        # Prepare data for regression
        df = pd.DataFrame(expenses)
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.month
        df['year'] = df['date'].dt.year
        df['month_index'] = (df['year'] - df['year'].min()) * 12 + df['month']
        
        # Group by month and calculate monthly totals
        monthly_totals = df.groupby('month_index')['amount'].sum().reset_index()
        
        if len(monthly_totals) < 2:
            # If not enough monthly data, use simple average
            avg_monthly = df['amount'].sum() / max(1, (df['date'].max() - df['date'].min()).days / 30)
            return jsonify({
                'prediction': {
                    'predictedMonthlyBudget': float(avg_monthly),
                    'confidence': 0.6,
                    'method': 'simple_average'
                }
            })
        
        # Prepare features and target
        X = monthly_totals['month_index'].values.reshape(-1, 1)
        y = monthly_totals['amount'].values
        
        # Train linear regression model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict next month
        next_month_index = monthly_totals['month_index'].max() + 1
        predicted_budget = model.predict([[next_month_index]])[0]
        
        # Calculate confidence based on R² score
        r2_score = model.score(X, y)
        confidence = max(0.5, min(0.95, r2_score))
        
        return jsonify({
            'prediction': {
                'predictedMonthlyBudget': float(max(0, predicted_budget)),
                'confidence': float(confidence),
                'method': 'linear_regression',
                'r2_score': float(r2_score)
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Error in budget prediction'
        }), 500

@app.route('/analyze-patterns', methods=['POST'])
def analyze_patterns():
    """
    Analyze spending patterns using K-means clustering
    """
    try:
        data = request.json
        expenses = data.get('expenses', [])
        
        if len(expenses) < 5:
            return jsonify({
                'clusters': None,
                'message': 'Need at least 5 expenses for pattern analysis'
            }), 400
        
        df = pd.DataFrame(expenses)
        
        # Encode categories
        category_map = {
            'Food': 1, 'Transport': 2, 'Shopping': 3, 'Bills': 4,
            'Entertainment': 5, 'Healthcare': 6, 'Education': 7, 'Other': 8
        }
        df['category_encoded'] = df['category'].map(category_map)
        
        # Prepare features: amount and category
        features = df[['amount', 'category_encoded']].values
        
        # Standardize features
        scaler = StandardScaler()
        features_scaled = scaler.fit_transform(features)
        
        # Determine optimal number of clusters (between 2 and min(5, len/2))
        n_clusters = min(5, max(2, len(df) // 3))
        
        # Apply K-means clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        df['cluster'] = kmeans.fit_predict(features_scaled)
        
        # Analyze clusters
        clusters_analysis = []
        for i in range(n_clusters):
            cluster_data = df[df['cluster'] == i]
            if len(cluster_data) > 0:
                clusters_analysis.append({
                    'cluster_id': int(i),
                    'category': cluster_data['category'].mode()[0] if len(cluster_data['category'].mode()) > 0 else 'Mixed',
                    'averageAmount': float(cluster_data['amount'].mean()),
                    'totalAmount': float(cluster_data['amount'].sum()),
                    'count': int(len(cluster_data)),
                    'description': f"Pattern {i+1}: Average ${cluster_data['amount'].mean():.2f} per transaction"
                })
        
        # Group by category for simpler view
        category_summary = df.groupby('category').agg({
            'amount': ['sum', 'mean', 'count']
        }).reset_index()
        category_summary.columns = ['category', 'totalAmount', 'averageAmount', 'count']
        
        return jsonify({
            'clusters': [
                {
                    'category': row['category'],
                    'totalAmount': float(row['totalAmount']),
                    'averageAmount': float(row['averageAmount']),
                    'count': int(row['count'])
                }
                for _, row in category_summary.iterrows()
            ],
            'pattern_analysis': clusters_analysis,
            'method': 'kmeans_clustering'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Error in pattern analysis'
        }), 500

@app.route('/detect-anomalies', methods=['POST'])
def detect_anomalies():
    """
    Detect spending anomalies using statistical methods and clustering
    """
    try:
        data = request.json
        expenses = data.get('expenses', [])
        
        if len(expenses) < 5:
            return jsonify({
                'anomalies': [],
                'message': 'Need at least 5 expenses for anomaly detection'
            }), 400
        
        df = pd.DataFrame(expenses)
        df['date'] = pd.to_datetime(df['date'])
        
        anomalies = []
        
        # Method 1: Statistical outlier detection (Z-score)
        amounts = df['amount'].values
        mean_amount = np.mean(amounts)
        std_amount = np.std(amounts)
        
        if std_amount > 0:
            z_scores = np.abs((amounts - mean_amount) / std_amount)
            threshold = 2.5  # Standard deviation threshold
            
            for idx, (z_score, row) in enumerate(zip(z_scores, df.itertuples())):
                if z_score > threshold:
                    anomalies.append({
                        'index': int(idx),
                        'amount': float(row.amount),
                        'category': row.category,
                        'date': row.date.isoformat() if hasattr(row.date, 'isoformat') else str(row.date),
                        'reason': f'Amount exceeds mean by {z_score:.2f} standard deviations',
                        'z_score': float(z_score),
                        'method': 'statistical'
                    })
        
        # Method 2: Category-based anomaly detection
        category_stats = df.groupby('category')['amount'].agg(['mean', 'std']).reset_index()
        
        for _, row in df.iterrows():
            cat_stats = category_stats[category_stats['category'] == row['category']]
            if len(cat_stats) > 0 and cat_stats.iloc[0]['std'] > 0:
                cat_mean = cat_stats.iloc[0]['mean']
                cat_std = cat_stats.iloc[0]['std']
                
                if row['amount'] > cat_mean + 2 * cat_std:
                    # Check if not already added
                    if not any(a['index'] == row.name for a in anomalies):
                        anomalies.append({
                            'index': int(row.name),
                            'amount': float(row['amount']),
                            'category': row['category'],
                            'date': row['date'].isoformat() if hasattr(row['date'], 'isoformat') else str(row['date']),
                            'reason': f'Unusually high for {row["category"]} category (mean: ${cat_mean:.2f})',
                            'method': 'category_based'
                        })
        
        # Sort by amount (highest first)
        anomalies.sort(key=lambda x: x['amount'], reverse=True)
        
        return jsonify({
            'anomalies': anomalies[:10],  # Return top 10 anomalies
            'total_detected': len(anomalies),
            'method': 'combined_statistical'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Error in anomaly detection'
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
