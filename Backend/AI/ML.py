import os
import json
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Input
from datetime import datetime, timedelta
import random

# Suppress TensorFlow logging and oneDNN warnings
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Function to generate synthetic data
def generate_synthetic_data(num_records):
    data = []
    for i in range(num_records):
        record = {
            "ID": i + 1,
            "time": (datetime.now() - timedelta(days=random.randint(0, 10))).isoformat(),
            "GPS": {
                "LAT": round(random.uniform(36.0, 37.0), 6),
                "LNG": round(random.uniform(10.0, 11.0), 6)
            },
            "Acceleration": {
                "X": round(random.uniform(-200.0, 200.0), 2),
                "Y": round(random.uniform(-200.0, 200.0), 2),
                "Z": round(random.uniform(-200.0, 200.0), 2)
            },
            "Gyroscope": {
                "X": round(random.uniform(-20.0, 20.0), 2),
                "Y": round(random.uniform(-20.0, 20.0), 2),
                "Z": round(random.uniform(-20.0, 20.0), 2)
            },
            "falling": random.choice(["Yes", "No"])
        }
        data.append(record)
    return data

# Generate 5000 synthetic records
synthetic_data = generate_synthetic_data(50000)

# Save to JSON file
with open('synthetic_data.json', 'w') as file:
    json.dump(synthetic_data, file, indent=2)

# Load synthetic data
with open('synthetic_data.json') as file:
    data = json.load(file)

# Extract features and labels
features = []
labels = []

for record in data:
    features.append([
        record['GPS']['LAT'], record['GPS']['LNG'],
        record['Acceleration']['X'], record['Acceleration']['Y'], record['Acceleration']['Z'],
        record['Gyroscope']['X'], record['Gyroscope']['Y'], record['Gyroscope']['Z']
    ])
    labels.append(record['falling'])

# Convert to numpy arrays and preprocess
features = np.array(features)
labels = LabelEncoder().fit_transform(labels)

scaler = StandardScaler()
features = scaler.fit_transform(features)

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# KNN Model
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
knn_prob = knn.predict_proba(X_test)[:, 1]  # Probability estimates for class 1
knn_accuracy = accuracy_score(y_test, knn.predict(X_test))

# Decision Tree Model
dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train, y_train)
dt_prob = dt.predict_proba(X_test)[:, 1]
dt_accuracy = accuracy_score(y_test, dt.predict(X_test))

# Random Forest Model
rf = RandomForestClassifier(random_state=42)
rf.fit(X_train, y_train)
rf_prob = rf.predict_proba(X_test)[:, 1]
rf_accuracy = accuracy_score(y_test, rf.predict(X_test))

# SVM Model
svm = SVC(probability=True, random_state=42)
svm.fit(X_train, y_train)
svm_prob = svm.predict_proba(X_test)[:, 1]
svm_accuracy = accuracy_score(y_test, svm.predict(X_test))

# TensorFlow Neural Network Model
tf_model = Sequential([
    Input(shape=(8,)),
    Dense(16, activation='relu'),
    Dense(1, activation='sigmoid')  # Sigmoid for binary classification
])

tf_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
tf_model.fit(X_train, y_train, epochs=1, batch_size=16, verbose=0)

tf_pred = tf_model.predict(X_test).flatten()

# Plotting the accuracy of different models
results = {
    "KNN": knn_accuracy,
    "Decision Tree": dt_accuracy,
    "Random Forest": rf_accuracy,
    "SVM": svm_accuracy,
    "Neural Network (TF)": accuracy_score(y_test, np.where(tf_pred >= 0.5, 1, 0))
}

plt.figure(figsize=(10, 6))
plt.bar(results.keys(), results.values(), color=['blue', 'orange', 'green', 'red', 'purple'])
plt.ylabel('Accuracy')
plt.title('Comparison of Model Accuracy')
plt.ylim(0, 1)
plt.show()

# Display detailed results
models = {"KNN": knn, "Decision Tree": dt, "Random Forest": rf, "SVM": svm}
for model_name, model in models.items():
    print(f"{model_name}:\nAccuracy: {results[model_name]:.2f}")
    print("Classification Report:")
    print(classification_report(y_test, model.predict(X_test)))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, model.predict(X_test)))
    print("\n" + "-"*50 + "\n")

print(f"Neural Network (TF):\nAccuracy: {results['Neural Network (TF)']:.2f}")
print("Classification Report:")
print(classification_report(y_test, np.where(tf_pred >= 0.5, 1, 0)))
print("Confusion Matrix:")
print(confusion_matrix(y_test, np.where(tf_pred >= 0.5, 1, 0)))

# Print model predictions
print("\nPredictions by each model:")
print("\nKNN Predictions (probabilities):")
print(knn_prob[:20])

print("\nDecision Tree Predictions (probabilities):")
print(dt_prob[:20])

print("\nRandom Forest Predictions (probabilities):")
print(rf_prob[:20])

print("\nSVM Predictions (probabilities):")
print(svm_prob[:20])

print("\nNeural Network (TF) Predictions:")
print(tf_pred[:20])
