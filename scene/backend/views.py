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
from bs4 import BeautifulSoup
from dotenv import load_dotenv
load_dotenv()
import os
import certifi
uri = os.getenv("MONGO_URI")

@csrf_exempt
def searchView(request):
    info = json.loads(request.body.decode("utf-8"))
    print(info)
    try:
        search = " ".join([x.title() for x in info["search"].split(" ")])
        if info["genre"] == "Genre":
            genre = ""
        if info["rating"] != "" : 
            rating = float(info["rating"]) 
        else:
            rating =  3.0
        client = MongoClient(uri,27017,tlsCAFile=certifi.where())
        db = client["scene"]
        if search != "":
            genre = " ".join([x.title() for x in info["genre"].split(" ")])
            director = " ".join([x.title() for x in info["search"].split(" ")])
            actors = " ".join([x.title() for x in info["search"].split(" ")])
            automate = {"directors":{"search":director},"actors":{"search":actors}}
            for key in automate:
                huh = automate[key]["search"]
                data = db["movies"].find({
                            'genres':{'$regex':f"^.*{genre}.*$"},
                            key:{'$regex':f"^.*{huh}.*$"},
                        "audience_rating":{"$gte":rating*20}
                        },show_record_id=False)
                query = pd.DataFrame(list(data))
                automate[key]["result"] = query
            films = pd.concat([automate[x]["result"] for x in list(automate.keys())])
            if films.index.size < 1:
                data = db["movies"].find({ "$text": { "$search": search },
                                        "audience_rating":{"$gte":rating*20} 
                                        },show_record_id=False).sort([( "score", { "$meta": "textScore" })])
                films = pd.DataFrame(list(data))
                if films.index.size > 0:
                    reference_film = films.iloc[0]
                    genre = reference_film["genres"].split(",")[0]
                    director = ""
                    data = db["movies"].find({
                                'genres':{'$regex':f"^.*{genre}.*$"},
                            "audience_rating":{"$gte":rating*20}
                            },show_record_id=False)
                    stuff = list(data)
                    stuff.insert(0,reference_film.to_dict())
                    films = pd.DataFrame(stuff)
            else:
                reference_film = films.iloc[0]
        else:
            genre = " ".join([x.title() for x in info["genre"].split(" ")])
            data = db["movies"].find({
                            'genres':{'$regex':f"^.*{genre}.*$"},
                        "audience_rating":{"$gte":rating*20}
                        },show_record_id=False)
            films = pd.DataFrame(list(data))
            reference_film = films.iloc[0]
        client.close()
        films["rating"] = [float(x/20) for x in films["audience_rating"]]
        rec_films = films.sort_values("rating",ascending=False)[["movie_title","rating","directors","genres","actors","youtubeId","imageId"]]
        try:
            rec_films["actors"] = [",".join(str(x).split(",")[:10]) for x in rec_films["actors"]]
        except:
            rec_films["actors"] = ""
        rec_films.rename(columns={"directors":"director","genres":"genre","actors":"starring"},inplace=True)
        reference_film["director"] = reference_film["directors"]
        reference_film["genre"] = reference_film["genres"]
        try:
            reference_film["starring"] = [",".join(str(x).split(",")[:10]) for x in reference_film["actors"]]
        except:
            reference_film["starring"] = ""
        reference_film["rating"] = float(reference_film["audience_rating"]/20)
        films = rec_films[["movie_title","rating","director","genre","starring","youtubeId","imageId"]].sample(frac=1).iloc[:10].sort_values("rating",ascending=False)
        complete = reference_film[["movie_title","rating","director","genre","starring","youtubeId","imageId"]].to_dict()
        complete["films"]=list(films.to_dict("records"))
    except Exception as e:
        complete = {"movie_title":"Not Found"
                    ,"rating":"Not Found"
                    ,"director":"Not Found"
                    ,"genre":"Not Found"
                    ,"youtubeId":"Not Found",
                    "imageId":"Not Found",
                    "starring":"Not Found"
                    ,"films":[]}
        print(str(e))
    complete["sentiment"] = False
    complete["search"] = ""
    return JsonResponse(complete,safe=False)

@csrf_exempt
def backendView(request):
    info = json.loads(request.body.decode("utf-8"))
    try:
        movie_title = " ".join([x.title() for x in info["movie_title"].split(" ")])
        if movie_title != "":
            client = MongoClient(uri,27017,tlsCAFile=certifi.where())
            print(movie_title)
            db = client["scene"]
            data = db["movies"].find({ "$text": { "$search": movie_title } },show_record_id=False).sort([( "score", { "$meta": "textScore" })])
            films = pd.DataFrame(list(data))
            print(films.head(1))
            client.close()
            if films.index.size > 0:
                reference_film = films.iloc[0]
                genre = reference_film["genres"].split(",")[0]
                # director = reference_film["directors"].split(",")[0]
                director = ""
            else:
                genre = "Not Found"
                director = "Not Found"
        else:
            genre = " ".join([x.title() for x in info["genre"].split(" ")])
            director = " ".join([x.title() for x in info["director"].split(" ")])
        if info["rating"] != "" : 
            rating = float(info["rating"]) 
        else:
            rating =  3.0
        print(genre,director,rating)
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
        rec_films = films.sort_values("rating",ascending=False)[["movie_title","rating","directors","genres","youtubeId","imageId"]]
        rec_films.rename(columns={"directors":"director","genres":"genre"},inplace=True)
        films = rec_films[["movie_title","rating","director","genre","youtubeId","imageId"]].sample(frac=1).iloc[:10].sort_values("rating",ascending=False)
        complete = films[["movie_title","rating","director","genre","youtubeId","imageId"]].iloc[0].to_dict()
        complete["films"]=list(films.to_dict("records"))
    except Exception as e:
        complete = {"movie_title":"Not Found"
                    ,"rating":"Not Found"
                    ,"director":"Not Found"
                    ,"genre":"Not Found"
                    ,"youtubeId":"Not Found",
                    "imageId":"Not Found"
                    ,"films":[]}
        print(str(e),films.columns)
    complete["sentiment"] = False
    return JsonResponse(complete,safe=False)

@csrf_exempt
def postView(request):
    info = json.loads(request.body.decode("utf-8"))
    try:
        client = MongoClient(uri,27017,tlsCAFile=certifi.where())
        db = client["scene"]
        table = db["user_data"]
        info["date"] = datetime.now()
        table.insert(info)
        client.close()
        current_films = info["films"]
        data = current_films.pop(0)
        data["films"] = current_films
        data["sentiment"] = "dislike"
    except Exception as e:
        data = info
        print("rekt",str(e))
    return JsonResponse(data,safe=False)

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
    final = []
    final.append("Genre")
    others = list(set(consolidate))
    others.sort()
    final.extend(others)
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