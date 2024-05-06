import json
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Input
import os

# Suppress TensorFlow logging
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

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

# Train and save KNN model
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
joblib.dump(knn, 'knn_model.pkl')

# Train and save Decision Tree model
dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train, y_train)
joblib.dump(dt, 'dt_model.pkl')

# Train and save Random Forest model
rf = RandomForestClassifier(random_state=42)
rf.fit(X_train, y_train)
joblib.dump(rf, 'rf_model.pkl')

# Train and save SVM model
svm = SVC(probability=True, random_state=42)
svm.fit(X_train, y_train)
joblib.dump(svm, 'svm_model.pkl')

# Train and save Neural Network model
tf_model = Sequential([
    Input(shape=(8,)),
    Dense(16, activation='relu'),
    Dense(1, activation='sigmoid')
])
tf_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
tf_model.fit(X_train, y_train, epochs=50, batch_size=16, verbose=0)
tf_model.save('tf_model.h5')

# Save scaler
joblib.dump(scaler, 'scaler.pkl')

# Evaluate models and print metrics
models = {'KNN': knn, 'Decision Tree': dt, 'Random Forest': rf, 'SVM': svm}
for model_name, model in models.items():
    print(f"{model_name} Accuracy: {accuracy_score(y_test, model.predict(X_test)):.2f}")
    print(classification_report(y_test, model.predict(X_test)))
    print(confusion_matrix(y_test, model.predict(X_test)))
# Evaluate Neural Network model
tf_pred = np.where(tf_model.predict(X_test).flatten() >= 0.5, 1, 0)
print(f"Neural Network (TF) Accuracy: {accuracy_score(y_test, tf_pred):.2f}")
print(classification_report(y_test, tf_pred))
print(confusion_matrix(y_test, tf_pred))
