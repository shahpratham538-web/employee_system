import requests
import sys

url = "https://employeesystem-production-ee11.up.railway.app/api/token/"
data = {"username":"admin", "password":"admin123"}

try:
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("SUCCESS! The live backend works perfectly and the admin account exists.")
        print(response.json())
        sys.exit(0)
    else:
        print(f"FAILED: Status {response.status_code}")
        print(response.text)
        sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
