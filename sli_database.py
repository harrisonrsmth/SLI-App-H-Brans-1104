import mysql.connector as mysql
from dotenv import load_dotenv
import os
import uuid

load_dotenv()
SQL_HOST = os.getenv("SQL_HOST")
SQL_USER = os.getenv('SQL_USER')
SQL_PASSWORD = os.getenv('SQL_PASSWORD')

class DB:

    def __init__(self):

        self.db = mysql.connect(
            host = SQL_HOST,
            user = SQL_USER,
            passwd = SQL_PASSWORD,
            database = "sli_database",
            autocommit = True
        )

        self.cursor = self.db.cursor()
        self.cursor.close()

    def getStudentLogin(self, username):
        self.cursor = self.db.cursor()
        self.cursor.execute("SELECT id, username, password FROM student WHERE username LIKE \"%" + str(username) + "\"")
        result = self.cursor.fetchall()
        self.cursor.close()
        return result

    def getTeacherLogin(self, email):
        self.cursor = self.db.cursor()
        sql = "SELECT id, email, password FROM teacher WHERE email = %s"
        get_email = (str(email), )
        self.cursor.execute(sql, get_email)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result

    def getTeacherInfo(self, user_id):
        self.cursor = self.db.cursor()
        sql = "SELECT fname FROM teacher WHERE id = %s"
        get_teacher_info = (str(user_id), )
        self.cursor.execute(sql, get_teacher_info)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result

    def getUserToken(self, token):
        self.cursor = self.db.cursor()

        print("entered sql")
        sql = "SELECT id, token FROM token WHERE token = %s"
        print("wrote sql script")
        get_token = (str(token), )
        print("got token")
        #################################################
        self.cursor.execute(sql, get_token)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result

    def insertToken(self, userId, token):
        self.cursor = self.db.cursor()
        deleted_old_token = "DELETE FROM token WHERE id = %s"
        del_input = (str(userId), )
        self.cursor.execute(deleted_old_token, del_input)

        sql = "INSERT INTO token VALUES (%s, %s)"
        input = (str(userId), str(token))
        self.cursor.execute(sql, input)
        self.cursor.close()
        return "ok"

    def createNewClass(self, teacher_id, class_name):
        self.cursor = self.db.cursor()

        insert_sql = "INSERT INTO class VALUES (%s, %s)"

        insert_input = (str(teacher_id), str(class_name))
        self.cursor.execute(insert_sql, insert_input)
        print("slslsls")
        self.cursor.close()
        return "good enough"

    def deleteToken(self, id):
        self.cursor = self.db.cursor()
        print("deleting...")
        sql = "DELETE FROM token WHERE id = %s"
        del_input = (str(id), )
        self.cursor.execute(sql, del_input)
        print("deleted!")
        self.cursor.close()

    def createTeacherAccount(self, email, password, fname, lname):
        self.cursor = self.db.cursor()
        self.cursor.execute("INSERT INTO teacher VALUES (NULL, \"%s\", \"%s\", \"%s\", \"%s\")"%(email, password, fname, lname))
        self.cursor.close()

    def getClasses(self, teacher_id):
        self.cursor = self.db.cursor()
        sql = "SELECT className FROM class WHERE %s"
        get_id = (str(teacher_id), )
        self.cursor.execute(sql, get_id)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result

    def logWork(self, date, project, hours, description, SDG):
        self.cursor = self.db.cursor()
        id = uuid.uuid4()
        insert_sql = "INSERT INTO work VALUES (%s, %s, %s, %s, %s, id)"
        
        insert_input = (str(date), str(project), float(hours), str(description), str(SDG), id)
        self.cursor.execute(insert_sql, insert_input)
        print("slslsls")
        self.cursor.close()
        return "good enough"