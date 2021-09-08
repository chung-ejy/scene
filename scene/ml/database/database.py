from database.adatabase import ADatabase

class Database(ADatabase):
    def __init__(self,database_name):
        super().__init__(database_name)