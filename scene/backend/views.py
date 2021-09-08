from django.shortcuts import render
from django.http.response import JsonResponse
import pickle
import pandas as pd
import json
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from pymongo import MongoClient
import math
import requests as r
from dotenv import load_dotenv
load_dotenv()
import os
uri = os.getenv("MONGO_URI")
token = os.getenv("GOOGLE_API")
client = MongoClient(uri,tlsCAFile=certifi.where())
db = client["scene"]
table = db["movies"]
data = table.find(show_record_id=False)
movies =  pd.DataFrame(list(data))
movies.dropna(inplace=True)
movies["genres"] = [x.lower() for x in movies["genres"]]
movies["directors"] = [x.lower() for x in movies["directors"]]
movies["rating"] = [round(x/20,1) for x in movies["audience_rating"]]
movies = movies.groupby(by=["genres","directors","movie_title"]).mean().reset_index()
@csrf_exempt
def backendView(request):
    info = json.loads(request.body.decode("utf-8"))
    try:
        genre = info["genre"]
        director = info["director"]
        rating = info["rating"]
        query_identifiers = {}
        if genre != "" and genre != "None":
            query_identifiers["genres"] = genre.lower()
        if rating != "":
            query_identifiers["rating"] = float(rating)
        if director != "":
            query_identifiers["directors"] = director.lower()
        films = movies.copy()
        for query_identifier in query_identifiers.keys():
            new_data = []
            for row in films.iterrows():
                if query_identifier == "rating":
                    if row[1]["rating"] >= query_identifiers[query_identifier]:
                        new_data.append(row[1])
                else:
                    if query_identifiers[query_identifier] in row[1][query_identifier]:
                        new_data.append(row[1])
            films = pd.DataFrame(new_data)
        complete = info
        rec_films = films.sort_values("rating",ascending=False)[["movie_title","rating","directors","genres"]].sample(frac=1)
        complete = {}
        rec_films.rename(columns={"directors":"director","genres":"genre"},inplace=True)
        rec_films["title"] = [str(x.replace(" ","")) for x in rec_films["movie_title"]]
        rec_films["director"] = [x.title() for x in rec_films["director"]]
        complete = rec_films[["movie_title","rating","director","genre"]].iloc[0].to_dict()
        params = {"part":"snippet"}
        query = complete['movie_title'] + ' trailer'
        test = r.get(f"https://www.googleapis.com/youtube/v3/search?q={query}&key={token}",params=params).json()
        complete["youtubeId"] = test['items'][0]["id"]["videoId"]
        complete["director"] = complete["director"].title()
        films = rec_films[["movie_title","rating","director","genre"]].sort_values("rating",ascending=False).iloc[:10]
        youtubeIds = []
        for movie_title in films["movie_title"]:
            query = movie_title + ' trailer'
            test = r.get(f"https://www.googleapis.com/youtube/v3/search?q={query}&key={token}",params=params).json()
            youtubeIds.append(test['items'][0]["id"]["videoId"])
        films["youtubeId"] = youtubeIds
        complete["films"]=list(films.to_dict("records"))
    except Exception as e:
        complete = {"movie_title":"Not Found"
                    ,"rating":"Not Found"
                    ,"director":"Not Found"
                    ,"genre":"Not Found"
                    ,"youtubeId":"Not Found"
                    ,"films":[]}
        print(str(e))
    complete["sentiment"] = False
    return JsonResponse(complete,safe=False)

@csrf_exempt
def postView(request):
    info = json.loads(request.body.decode("utf-8"))
    try:
        db = client["scene"]
        table = db["user_data"]
        table.insert(info)
    except Exception as e:
        print("rekt",str(e))
    return JsonResponse({"hi":"hi"},safe=False)

@csrf_exempt
def getGenre(request):
    genres = list(movies["genres"].unique())
    consolidate = []
    for genre in genres:
        consolidate.extend([x.strip() for x in genre.split(",")])
    final = list(set(consolidate))
    final.sort()
    final.append("None")
    return JsonResponse({"genres":final},safe=False)