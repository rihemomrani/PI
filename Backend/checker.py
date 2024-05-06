import pymongo as md
from datetime import datetime
import requests
import time

# MongoDB setup
try:
    client = md.MongoClient("localhost", 27017, ServerSelectionTimeoutMS=5000)
    db = client["Fall_detection"]
    table_rtdbs = db["rtdbs"]  # Collection for real-time database updates
    table_clients = db["clients"]  # Collection for clients
    table_reports = db["reports"]
except Exception as e:
    print("Error connecting to MongoDB: ", str(e))
    exit()

# Function to fetch sensor data from ESP32 web server
def fetch_sensor_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error if the request failed
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching sensor data: {e}")
        return None

while True:
    # URL of your ESP32 web server for updated data path
    url = "http://192.168.1.15/data"
    sensor_data = fetch_sensor_data(url)
    
    if sensor_data and 'lat' in sensor_data and 'lng' in sensor_data:
        # Assume fall detection based on acceleration magnitude (simplified example)
        ax, ay, az = sensor_data.get('ax', 0), sensor_data.get('ay', 0), sensor_data.get('az', 0)
        acceleration_magnitude = (ax**2 + ay**2 + az**2)**0.5
        is_falling = "Yes" if acceleration_magnitude > 25 else "No"  # Simplified threshold, adjust as needed

        # Update rtdbs collection
        doc_rtdbs = {
            "$set": {
                "GPS": {"LAT": sensor_data['lat'], "LNG": sensor_data['lng']},
                "Acceleration": {"X": ax, "Y": ay, "Z": az},
                "Gyroscope": {"X": sensor_data.get('gx', 0), "Y": sensor_data.get('gy', 0), "Z": sensor_data.get('gz', 0)},
                "Sensor": {"data": "Working fine"},
                "falling": is_falling
            }
        }
        table_rtdbs.update_one({"ID": 1}, doc_rtdbs, upsert=True)
        print(f"Updated sensor data for ID=1 with {doc_rtdbs}")

        # Update clients collection with fall detection and time
        now = datetime.now()  # Current date and time
        doc_clients = {
            "$set": {
                "Day": now.day,
                "Hours": now.strftime("%I %p"),  # Format hours in 12-hour clock
                "Status": "online",
                "falling": is_falling,
                "month": now.strftime("%B").lower(),  # Month as full name, lowercase
                "year": now.year
            }
        }
        table_clients.update_one({"ID": 1}, doc_clients, upsert=True)
        print(f"Updated client data for ID=1 with status online, falling: {is_falling}, and current time {now}")
        if(is_falling=="Yes"):
            fall_report = {
                "ID": 1,
                "time": datetime.now(),
                "GPS": {"LAT": sensor_data['lat'], "LNG": sensor_data['lng']},
                "Acceleration": {"X": ax, "Y": ay, "Z": az},
                "Gyroscope": {"X": sensor_data.get('gx', 0), "Y": sensor_data.get('gy', 0), "Z": sensor_data.get('gz', 0)},
                "falling": is_falling
            }
            table_reports.insert_one(fall_report)
            print("Fall detected and report saved:", fall_report)
    else:
        print("Failed to fetch sensor data or data is invalid.")

    time.sleep(5)  # Fetch sensor data every 5 seconds
