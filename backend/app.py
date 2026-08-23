from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Xin chào Flask!"

@app.route("/about")
def about():
    return "Đây là trang giới thiệu."

@app.route("/products")
def products():
    return "Đây là trang sản phẩm."

if __name__ == "__main__":
    app.run(debug=True)