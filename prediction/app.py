from flask import Flask, request, jsonify
import numpy as np
import joblib

app = Flask(__name__)

# Load the trained model and encoders
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
season_encoder = joblib.load("season_encoder.pkl")
label_encoder = joblib.load("label_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json  # Get JSON data from request

        fym = float(data["fym"])
        n = float(data["n"])
        p2o5 = float(data["p2o5"])
        k2o = float(data["k2o"])
        ph = float(data["ph"])
        season = data["season"].strip()

        # Validate season input
        if season not in season_encoder.classes_:
            return jsonify({"error": f"Invalid season '{season}'"}), 400

        # Encode season
        season_encoded = season_encoder.transform([season])[0]

        # Prepare input for prediction
        input_data = np.array([[fym, n, p2o5, k2o, ph, season_encoded]])
        input_scaled = scaler.transform(input_data)

        # Predict crop
        crop_encoded = model.predict(input_scaled)[0]
        crop = label_encoder.inverse_transform([crop_encoded])[0]

        return jsonify({"predicted_crop": crop})
    
    except ValueError:
        return jsonify({"error": "Invalid numerical values"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Use port 5000 for Flask
