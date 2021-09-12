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
import certifi

uri = os.getenv("MONGO_URI")

@csrf_exempt
def backendView(request):
    info = json.loads(request.body.decode("utf-8"))
    try:
        genre = " ".join([x.title() for x in info["genre"].split(" ")])
        director = " ".join([x.title() for x in info["director"].split(" ")])
        if info["rating"] != "" : 
            rating = float(info["rating"]) 
        else:
            rating =  0.0
        client = MongoClient(uri,27017,tlsCAFile=certifi.where())
        db = client["scene"]
        data = db["movies"].find({
                                    'genres':{'$regex':f"^.*{genre}.*$"},
                                'directors':{'$regex':f"^.*{director}.*$"}
                                ,"audience_rating":{"$gte":rating*20}
                                },show_record_id=False)
        client.close()
        films = pd.DataFrame(list(data))
        films["rating"] = [float(x/20) for x in films["audience_rating"]]
        rec_films = films.sort_values("rating",ascending=False)[["movie_title","rating","directors","genres","youtubeId"]]
        rec_films.rename(columns={"directors":"director","genres":"genre"},inplace=True)
        films = rec_films[["movie_title","rating","director","genre","youtubeId"]].sample(frac=1).iloc[:10].sort_values("rating",ascending=False)
        complete = films[["movie_title","rating","director","genre","youtubeId"]].iloc[0].to_dict()
        complete["films"]=list(films.to_dict("records"))
    except Exception as e:
        complete = {"movie_title":"Not Found"
                    ,"rating":"Not Found"
                    ,"director":"Not Found"
                    ,"genre":"Not Found"
                    ,"youtubeId":"Not Found"
                    ,"films":[]}
        print(str(e),films.columns)
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
    client = MongoClient(uri,27017,tlsCAFile=certifi.where())
    db = client["scene"]
    data = db["movies"].find({},{"genres":1},show_record_id=False)
    client.close()
    movies = pd.DataFrame(list(data)).dropna()
    genres = list(movies["genres"].unique())
    consolidate = []
    for genre in genres:
        consolidate.extend([x.strip() for x in genre.split(",")])
    final = list(set(consolidate))
    final.sort()
    final.append("None")
    return JsonResponse({"genres":final},safe=False)

# @csrf_exempt
# def getYoutubeId(request):
#     try:
#         params = {"part":"snippet"}
#         info = json.loads(request.body.decode("utf-8"))
#         query = info["movie_title"] + ' trailer'
#         test = r.get(f"https://www.googleapis.com/youtube/v3/search?q={query}&key={token}",params=params).json()
#         info["youtubeId"] = test['items'][0]["id"]["videoId"]
#         complete = info
#     except Exception as e:
#         print(str(e))
#         complete = info
#         complete["youtubeId"] = ""
#     return JsonResponse(complete,safe=False)