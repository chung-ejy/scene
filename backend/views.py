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
        rating = int(info["rating"])
        if genre == "":
            query_identifier = "directors"
            query = director
        else:
            query_identifier = "genres"
            query = genre
        films = pd.DataFrame([row[1] for row in movies.iterrows() if query in row[1][query_identifier] and int(row[1]["audience_rating"]) >= rating])
        complete = info
        rec_films = films.sort_values("audience_rating",ascending=False)[["movie_title","audience_rating","directors","genres"]].sample(frac=1)
        complete["films"] = {}
        for row in rec_films.iterrows():
            title = str(row[1]["movie_title"]).replace(" ","")
            trailer = trailers[trailers["title"]==title]["youtubeId"]
            if len(trailer) > 0:
                if len(trailer) > 1:
                    complete["url"] = trailer[0].item()
                else:
                    complete["url"] = trailer.item()
                complete["films"] = row[1].to_dict()
                break
            else:
                continue
        if complete["films"] == {}:
            complete["url"] = "dQw4w9WgXcQ"  
    except Exception as e:
        complete = info
        complete["films"] = {}
        print(str(e))
    return JsonResponse(complete,safe=False)