import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier

# Create 'models' directory if it doesn't exist
os.makedirs("models", exist_ok=True)

# Load dataset
try:
    df = pd.read_csv("crop_nutrient_data_updated (1).csv")
    print("✅ Dataset loaded successfully!")
except Exception as e:
    print(f"❌ Error loading dataset: {e}")
    exit()

# ✅ Encode Crop labels
label_encoder = LabelEncoder()
df["Crop"] = label_encoder.fit_transform(df["Crop"])
joblib.dump(label_encoder, "models/label_encoder.pkl")
print("✅ Crop labels encoded and saved!")

# ✅ Encode Season labels properly
seasons = ["Summer", "Rainy", "Winter", "Early Winter", "Early Spring", "Early Summer"]

# Train a new LabelEncoder with predefined seasons
season_encoder = LabelEncoder()
season_encoder.fit(seasons)  # Fit with predefined seasons

df["Season"] = df["Season"].apply(lambda x: season_encoder.transform([x])[0] if x in seasons else None)

# Check for any None values (unrecognized seasons)
if df["Season"].isnull().sum() > 0:
    print("❌ Warning: Some seasons were not recognized! Check dataset.")
    exit()

joblib.dump(season_encoder, "models/season_encoder.pkl")
print("✅ Season encoder retrained and saved!")

# ✅ Prepare features and labels
X = df.drop(columns=["Crop"])
y = df["Crop"]

# ✅ Scale numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, "models/scaler.pkl")
print("✅ Scaler trained and saved!")

# ✅ Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# ✅ Train model (RandomForest)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ✅ Save trained model
joblib.dump(model, "models/crop_model.pkl")
print("✅ Model retrained with pH & Season and saved in 'models/' folder! 🚀")
