
Ichrak
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from werkzeug.utils import secure_filename
from PIL import Image
from datetime import datetime
import numpy as np
import os

app = Flask(_name_)
CORS(app)

model = load_model("Date_Prediction_CNN.keras")
class_names = ['Ajwa', 'Galaxy', 'Medjool', 'Meneifi', 'Nabtat Ali', 'Rutab', 'Shaishe', 'Sokari', 'Sugaey']

@app.route("/")
def index():
    return jsonify({"message": "Bienvenue sur l'API Datte Classifier"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"status": "error", "message": "Aucune image reçue"})

        file = request.files['image']
        if file.filename == '':
            return jsonify({"status": "error", "message": "Fichier vide"})

        filename = secure_filename(file.filename)
        os.makedirs("temp", exist_ok=True)
        filepath = os.path.join("temp", filename)
        file.save(filepath)

        img = Image.open(filepath).convert("RGB")
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array)
        predicted_class = class_names[np.argmax(prediction)]
        confiance = int(np.max(prediction) * 100)
        dateDetection = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        return jsonify({
            "status": "success",
            "predicted_class": predicted_class,
            "confiance": confiance,
            "dateDetection": dateDetection
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if _name_ == "_main_":
    app.run(debug=True)