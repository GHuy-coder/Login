import json
from pathlib import Path
from uuid import uuid4

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import hashlib, re

import random,string 




app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 6 * 1024 * 1024
CORS(app)


accounts = [
    
]

ACCOUNTS_FILE = Path(__file__).resolve().with_name("accounts.json")
POSTS_FILE = Path(__file__).resolve().with_name("posts.json")
ARTICLES_FILE = Path(__file__).resolve().with_name("articles.json")
IMAGES_DIR = Path(__file__).resolve().with_name("images")
MAX_AVATAR_SIZE = 5 * 1024 * 1024

IMAGES_DIR.mkdir(exist_ok=True)

with ACCOUNTS_FILE.open("r", encoding="utf-8-sig") as f:
    accounts = json.loads(f.read())

@app.errorhandler(413)
def upload_too_large(_error):
    return jsonify({"error": "Ảnh đại diện không được lớn hơn 5 MB"}), 413


@app.get("/")
def home():
    return "ÄÃ¢y lÃ  api blog há»c sinh"



def encrypt(data:str):
    return hashlib.md5(data.encode()).hexdigest()


def public_avatar_url(avatar):
    """Turn a stored backend image path into a URL the frontend can display."""
    if isinstance(avatar, str) and avatar.startswith("/images/"):
        return f"{request.host_url.rstrip('/')}{avatar}"
    return avatar or "/assets/DON-CUTE.jpg"


def detect_image_extension(data):
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith((b"GIF87a", b"GIF89a")):
        return ".gif"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return ".webp"
    return None


def save_avatar(upload):
    data = upload.read(MAX_AVATAR_SIZE + 1)
    if not data:
        raise ValueError("Vui lòng chọn một tệp ảnh")
    if len(data) > MAX_AVATAR_SIZE:
        raise ValueError("Ảnh đại diện không được lớn hơn 5 MB")

    extension = detect_image_extension(data)
    if extension is None:
        raise ValueError("Chỉ chấp nhận ảnh PNG, JPG, GIF hoặc WebP")

    filename = f"{uuid4().hex}{extension}"
    (IMAGES_DIR / filename).write_bytes(data)
    return f"/images/{filename}"


@app.get("/images/<path:filename>")
def uploaded_image(filename):
    return send_from_directory(IMAGES_DIR, filename)

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
                "success": "Login successfully!",
                "user": {
                    "email": account["email"],
                    "fullname": account["fullname"],
                    "classroom": account["classroom"],
                    "avatar": public_avatar_url(account.get("avatar"))
                }
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

        
# /api/forgot
# @param email
@app.post("/api/forgot")
def forgot():

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({
            "error": "Body should be a JSON"
        }),400

    email = data.get("email")

    length = 8
    password = "".join(random.choices(string.ascii_letters + string.digits, k= length))

    if password:

        for account in accounts:
            if account["email"] == email:
                # MÃ£ hÃ³a nÃ³ trÆ°á»›c
                new_password = encrypt(password)
                # gÃ¡n máº­t kháº©u má»›i vÃ o account
                account["password"] = new_password
                break
        else:
            return jsonify({
                "error": "Email not found"
            })

    
        with open("accounts.json", "w", encoding="utf-8") as f:
            f.write(json.dumps(accounts))   

        return jsonify({
            "success": f"Your password is {password}"
        })


@app.put("/api/profile")
def update_profile():
    if request.mimetype == "multipart/form-data":
        data = request.form
    else:
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify({"error": "Dữ liệu gửi lên không hợp lệ"}), 400

    original_email = data.get("original_email")
    email = data.get("email")
    fullname = data.get("fullname")
    classroom = data.get("classroom")
    avatar_upload = request.files.get("avatar")

    fields = {
        "Email": email,
        "Họ và tên": fullname,
        "Lớp": classroom,
    }
    for label, value in fields.items():
        if not isinstance(value, str) or not value.strip():
            return jsonify({"error": f"{label} không được để trống"}), 400

    if not isinstance(original_email, str) or not original_email.strip():
        return jsonify({"error": "Không xác định được tài khoản cần cập nhật"}), 400

    email = email.strip()
    fullname = fullname.strip()
    classroom = classroom.strip()

    account = next(
        (item for item in accounts if item["email"] == original_email),
        None
    )
    if account is None:
        return jsonify({"error": "Không tìm thấy tài khoản"}), 404

    email_owner = next(
        (item for item in accounts if item["email"] == email and item is not account),
        None
    )
    if email_owner is not None:
        return jsonify({"error": "Email đã được sử dụng"}), 400

    avatar = account.get("avatar", "/assets/DON-CUTE.jpg")
    if avatar_upload and avatar_upload.filename:
        try:
            avatar = save_avatar(avatar_upload)
        except ValueError as error:
            return jsonify({"error": str(error)}), 400

    account.update({
        "email": email,
        "fullname": fullname,
        "classroom": classroom,
        "avatar": avatar
    })

    with ACCOUNTS_FILE.open("w", encoding="utf-8") as f:
        json.dump(accounts, f, ensure_ascii=False, indent=2)

    return jsonify({
        "success": "Cập nhật thông tin thành công",
        "user": {
            "email": account["email"],
            "fullname": account["fullname"],
            "classroom": account["classroom"],
            "avatar": public_avatar_url(account["avatar"])
        }
    }), 200


@app.get("/api/articles-index")
def get_article_index():
    with POSTS_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    return jsonify(data)

@app.get("/api/articles")
def get_articles():
    with ARTICLES_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    return jsonify(data)
        




if __name__ == "__main__":
    app.run(debug=True)

