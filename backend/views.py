from django.shortcuts import render
from django.http.response import JsonResponse
import pickle
import pandas as pd
import json
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
import requests
from pymongo import MongoClient
import math
client = MongoClient("localhost",27017)
db = client["scene"]
table = db["movies"]
data = table.find(show_record_id=False)
movies =  pd.DataFrame(list(data))
movies.dropna(inplace=True)
movies["genres"] = [x.lower() for x in movies["genres"]]
movies["directors"] = [x.lower() for x in movies["directors"]]
movies["rating"] = [round(x/20,1) for x in movies["audience_rating"]]
movies = movies.groupby(by=["genres","directors","movie_title"]).mean().reset_index()
table = db["trailers"]
data = table.find(show_record_id=False)
trailers =  pd.DataFrame(list(data))
trailers["title"] = ["" .join(x.split(" ")[:-1]).replace(" ","") for x in trailers["title"]]
trailers.dropna(inplace=True)
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
        rec_films = rec_films.merge(trailers,on="title",how="left").dropna()
        rec_films["director"] = [x.title() for x in rec_films["director"]]
        complete = rec_films[["movie_title","rating","director","genre","youtubeId"]].iloc[0].to_dict()
        complete["director"] = complete["director"].title()
        complete["films"]=list(rec_films[["movie_title","rating","director","genre","youtubeId"]].sort_values("rating",ascending=False).iloc[:10].to_dict("records"))
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