from flask import Flask, render_template, request
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

data = pd.read_csv("data/products.csv")
data["combined"] = data["category"] + " " + data["tags"] + " " + data["description"]

vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(data["combined"])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

@app.route('/')
def home():
    return render_template("index.html", products=data.to_dict(orient="records"))

@app.route('/recommend', methods=['POST'])
def recommend():
    product_name = request.form['product']
    if product_name not in data['name'].values:
        return render_template("recommend.html", product=None, recommendations=[])
    
    idx = data.index[data['name'] == product_name][0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_indices = [i[0] for i in sim_scores[1:6]]
    recommendations = data.iloc[top_indices].to_dict(orient="records")
    
    return render_template("recommend.html", product=data.iloc[idx].to_dict(), recommendations=recommendations)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
