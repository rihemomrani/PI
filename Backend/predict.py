import json
import joblib
import numpy as np
import tensorflow as tf
import sys

# Load models and scaler
knn = joblib.load('knn_model.pkl')
dt = joblib.load('dt_model.pkl')
rf = joblib.load('rf_model.pkl')
svm = joblib.load('svm_model.pkl')
tf_model = tf.keras.models.load_model('tf_model.h5')
tf_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
scaler = joblib.load('scaler.pkl')

# Validate and read the JSON file
try:
    with open('input.json', 'r', encoding='utf-8') as f:
        input_data = json.load(f)
    features = np.array(input_data['features']).reshape(1, -1)
except Exception as e:
    print(f"Error reading input file: {e}")
    sys.exit(1)

scaled_features = scaler.transform(features)

# Perform predictions
predictions = {
    'KNN': int(knn.predict(scaled_features)[0]),
    'Decision Tree': int(dt.predict(scaled_features)[0]),
    'Random Forest': int(rf.predict(scaled_features)[0]),
    'SVM': int(svm.predict(scaled_features)[0]),
    'Neural Network (TF)': int(tf_model.predict(scaled_features)[0][0] >= 0.5)
}

# Print predictions as JSON with UTF-8 encoding
print(json.dumps(predictions))
#print(json.dumps(predictions, ensure_ascii=False).encode('utf-8').decode('utf-8'))
