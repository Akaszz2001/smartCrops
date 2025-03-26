# backend/python-scripts/crop_prediction.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Sample route for crop prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    soil_data = data.get("soil_data")
    climate_data = data.get("climate_data")
    
    # Replace with your ML model prediction logic
    predicted_crop = "Wheat"  # Dummy prediction
    return jsonify({"predicted_crop": predicted_crop})

# Run the server
if __name__ == '__main__':
    app.run(debug=True, port=5001)
