import json
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
import hashlib, re




app = Flask(__name__)
CORS(app)


accounts = [
    
]

ACCOUNTS_FILE = Path(__file__).resolve().with_name("accounts.json")

with ACCOUNTS_FILE.open("r", encoding="utf-8") as f:
    accounts = json.loads(f.read())

@app.get("/")
def home():
    return "Đây là api blog học sinh"



def encrypt(data:str):
    return hashlib.md5(data.encode()).hexdigest()

# /api/login
# @param email, password
@app.post("/api/login")
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({
            "error": "Body should be a JSON"
        }),400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not email.strip():
        return jsonify({
            "error": "Email should not be empty"
        }), 400

    if not isinstance(password, str) or not password.strip():
        return jsonify({
            "error": "password should not be empty"
        }), 400

    password = encrypt(password)
    print(password)


    print("accounts", accounts)

    for account in accounts:
        if email == account["email"] and password == account["password"]:
            return jsonify({
                "success": "Login successfully!"
            }), 200
    else:
        return jsonify({
            "error": "Wrong email or password"
        }), 400


def checkValidPassword(password):
    if len(password) <8 or len(password) > 20:
        return False
    else:
        return True
    


# /api/signup
# @param email, password, fullname, classroom
@app.post("/api/signup")
def signup():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({
            "error": "Body should be a JSON"
        }),400

    email = data.get("email")
    password = data.get("password")
    fullname = data.get("fullname")
    classroom = data.get("classroom")


    if not checkValidPassword(password):
        return jsonify({
                    "error": "Password shoule between 8 and 20 characters"
                }),400

    if not isinstance(email, str) or not email.strip():
        return jsonify({
            "error": "Email should not be empty"
        }), 400

    if not isinstance(password, str) or not password.strip():
        return jsonify({
            "error": "password should not be empty"
        }), 400

    if not isinstance(fullname, str) or not fullname.strip():
            return jsonify({
                "error": "fullname should not be empty"
            }), 400

    if not isinstance(classroom, str) or not classroom.strip():
            return jsonify({
                "error": "classroom should not be empty"
            }), 400

    password = encrypt(password)

    for account in accounts:
        if account["email"] == email:
            return jsonify({
                "error": "Email is existed, please use another"
            }), 400

    new_account = {
        "email": email,
        "password": password,
        "fullname": fullname,
        "classroom": classroom
    }



    accounts.append(new_account)

    with ACCOUNTS_FILE.open("w", encoding="utf-8") as f:
        f.write(json.dumps(accounts))

    print(accounts)
    return jsonify({
        "success": "Create new user succesfully!"
    }),200

        




        




if __name__ == "__main__":
    app.run(debug=True)
