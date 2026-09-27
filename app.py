from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained model
model = joblib.load("model/exoplanet_habitability_model.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    # Create dataframe with the same features used during training
    planet = pd.DataFrame([{
        "pl_rade": float(data["pl_rade"]),
        "pl_orbper": float(data["pl_orbper"]),
        "pl_eqt": float(data["pl_eqt"]),
        "pl_insol": float(data["pl_insol"]),
        "st_teff": float(data["st_teff"]),
        "st_rad": float(data["st_rad"]),
        "st_mass": float(data["st_mass"]),
        "st_logg": float(data["st_logg"])
    }])

    # Prediction
    prediction = model.predict(planet)[0]

    # Probability
    probability = model.predict_proba(planet)[0]

    if prediction == 1:
        result = "Potentially Habitable"
    else:
        result = "Not Potentially Habitable"

    return jsonify({
        "prediction": result,
        "not_habitable_probability": round(float(probability[0]) * 100, 2),
        "habitable_probability": round(float(probability[1]) * 100, 2)
    })


if __name__ == "__main__":
    app.run(debug=True)