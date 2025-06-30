from flask import Flask, request, jsonify
from flask_cors import CORS
from model import analyze_emotion, web_mining_for_recommendations

app = Flask(__name__)
CORS(app)

API_KEY = "AIzaSyD67bJlodJ_nb5uL_XHVpsa6WoM9lDO4Hg"
CSE_ID = "d438c5169bd6b4ac1"

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()

    if not data or "input" not in data:
        return jsonify({"error": "No input provided"}), 400

    user_input = data["input"].strip()

    if not user_input.replace(" ", "").isalpha():
        return jsonify({"error": "Invalid input. Only letters and spaces are allowed."}), 400

    try:
        emotion = analyze_emotion(user_input)
        query = f"{emotion} tips"
        results = web_mining_for_recommendations(query, API_KEY, CSE_ID)

        if not results:
            return jsonify({"error": "No results found for this emotion."}), 404

        return jsonify({
            "emotion": emotion,
            "tips": results[:5]
        })

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
