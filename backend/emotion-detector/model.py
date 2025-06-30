# model.py
import requests
from transformers import pipeline
classifier = pipeline("text-classification", model="bhadresh-savani/bert-base-go-emotion",return_all_scores=True, top_k=None)
def analyze_emotion(text):
    predictions = classifier(text)
    highest_score_label = max(predictions[0], key=lambda x: x['score'])
    return highest_score_label['label']
def web_mining_for_recommendations(query, api_key, cse_id):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "key": api_key,
        "cx": cse_id,
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        results = []
        search_results = response.json()
        if "items" in search_results:
            for item in search_results["items"]:
                title = item["title"]
                link = item["link"]
                snippet = item.get("snippet", "No description available.")
                results.append({"title": title, "link": link, "description": snippet})
        return results
    else:
        return []
