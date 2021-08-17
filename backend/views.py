from django.shortcuts import render
from django.http.response import JsonResponse
import pickle
import pandas as pd
import json
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
import requests
from pymongo import MongoClient
client = MongoClient("localhost",27017)
db = client["scene"]
table = db["movies"]
data = table.find(show_record_id=False)
movies =  pd.DataFrame(list(data))
table = db["trailers"]
data = table.find(show_record_id=False)
trailers =  pd.DataFrame(list(data))
trailers["title"] = ["" .join(x.split(" ")[:-1]).replace(" ","") for x in trailers["title"]]
movies.dropna(inplace=True)
trailers.dropna(inplace=True)
@csrf_exempt
def backendView(request):
    info = json.loads(request.body.decode("utf-8"))
    try:
        genre = info["genre"]
        director = info["director"]
        rating = info["rating"]
        query_identifiers = {}
        if genre != "":
            query_identifiers["genres"] = genre
        if rating != "":
            query_identifiers["rating"] = int(rating)
        if director != "":
            query_identifiers["directors"] = director
        films = movies.copy()
        for query_identifier in query_identifiers.keys():
            new_data = []
            for row in films.iterrows():
                if query_identifier == "rating":
                    if row[1]["audience_rating"] >= query_identifiers[query_identifier]:
                        new_data.append(row[1])
                else:
                    if query_identifiers[query_identifier] in row[1][query_identifier]:
                        new_data.append(row[1])
            films = pd.DataFrame(new_data)
        complete = info
        rec_films = films.sort_values("audience_rating",ascending=False)[["movie_title","audience_rating","directors","genres"]].sample(frac=1)
        complete = {}
        rec_films.rename(columns={"audience_rating":"rating","directors":"director","genres":"genre"},inplace=True)
        rec_films["title"] = [str(x.replace(" ","")) for x in rec_films["movie_title"]]
        rec_films = rec_films.merge(trailers,on="title",how="left").dropna()
        complete = rec_films[["movie_title","rating","director","genre","youtubeId"]].iloc[0].to_dict()
        complete["films"]=list(rec_films[["movie_title","rating","director","genre","youtubeId"]].sort_values("rating",ascending=False).to_dict("records"))
    except Exception as e:
        complete = {}
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