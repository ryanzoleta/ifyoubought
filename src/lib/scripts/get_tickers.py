import requests
import os
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()


offset = 0

r = requests.get(
    f"http://api.marketstack.com/v1/tickers?access_key={os.environ.get('MARKETSTACK_API_KEY')}&offset={offset}"
)

simplified = [
    {"name": ticker["name"], "symbol": ticker["symbol"]} for ticker in r.json()["data"]
]


with open("../data/tickers.json", "w") as f:
    json.dump(simplified, f)


print("Done")
