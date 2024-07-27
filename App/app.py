from flask import Flask, request, jsonify, render_template
from PIL import Image
import numpy as np
import tensorflow as tf
import pickle
import io

app = Flask(__name__)

# Load the trained model and label encoder
model = tf.keras.models.load_model('model/fruit_classifier_mobilenetv2_final.h5')
with open('model/label_encoder.pkl', 'rb') as file:
    label_encoder = pickle.load(file)

def preprocess_image(image):
    image = image.resize((224, 224))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/endpoints_list')
def endpoints_list():
    return render_template('endpoints_list.html')

@app.route('/storytelling')
def storytelling():
    return render_template('storytelling.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        image = Image.open(file.stream).convert('RGB')
        processed_image = preprocess_image(image)
        prediction = model.predict(processed_image)
        predicted_class = label_encoder.inverse_transform([np.argmax(prediction)])[0]
        return jsonify({'prediction': predicted_class}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)


