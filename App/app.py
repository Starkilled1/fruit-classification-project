import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


from flask import Flask, request, jsonify, render_template
import os
import numpy as np
from PIL import Image
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
import pickle

app = Flask(__name__)

# Load the trained model and label encoder
model = tf.keras.models.load_model('../NeuralNetwork_train_model/fruit_classifier_mobilenetv2_final.h5')
with open('../label_encoder.pkl', 'rb') as file:
    label_encoder = pickle.load(file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/storytelling')
def storytelling():
    return render_template('storytelling.html')

@app.route('/endpoints_list')
def endpoints_list():
    return render_template('endpoints_list.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        image = Image.open(file.stream).convert('RGB')
        image = image.resize((224, 224))  # Resize image to match model input shape
        image_array = np.array(image) / 255.0  # Normalize the image
        image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
        prediction = model.predict(image_array)
        predicted_class = label_encoder.inverse_transform([np.argmax(prediction)])[0]
        return jsonify({'prediction': predicted_class}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)



