import random
from datetime import datetime, timedelta
import json

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

# Generate 100 synthetic records
synthetic_data = generate_synthetic_data(1000)

# Save to JSON file
with open('synthetic_data.json', 'w') as file:
    json.dump(synthetic_data, file, indent=2)
