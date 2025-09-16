from flask import Flask, jsonify
import os
import pymysql
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parents[1] / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello World from Flask!"

@app.route("/db")
def test_db():
    try:
        connection = pymysql.connect(
            host=os.getenv("MARIADB_HOST"),
            port=int(os.getenv("MARIADB_PORT", 3306)),
            user=os.getenv("MARIADB_USER"),
            password=os.getenv("MARIADB_PASSWORD"),
            database=os.getenv("MARIADB_DATABASE")
        )
        with connection.cursor() as cursor:
            cursor.execute("SELECT NOW();")
            result = cursor.fetchone()
        connection.close()
        return jsonify({"status": "ok", "db_time": str(result[0])})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("SERVER_PORT", 8080)),
        debug=True
    )

