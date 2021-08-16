from extractor.iextractor import IExtractor
from requests import get
class AExtractor(IExtractor):
    
    def extract(self,api,params):
        return get("https://github.com/dev-ejc/")