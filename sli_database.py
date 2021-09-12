import mysql.connector as mysql
from dotenv import load_dotenv
import os

load_dotenv()
SQL_HOST = os.getenv("SQL_HOST")
SQL_USER = os.getenv('SQL_USER')
SQL_PASSWORD = os.getenv('SQL_PASSWORD')

class DB:

    def __init__(self):

        db_create = mysql.connect(
        host = SQL_HOST,
        user = SQL_USER,
        passwd = SQL_PASSWORD
        )


        self.db = mysql.connect(

            host = SQL_HOST,
            user = SQL_USER,
            passwd = SQL_PASSWORD,
            database = "sli_database",
            autocommit = True
        )

        self.cursor = self.db.cursor()

    def getStudentLogin(self, username):
        self.cursor.execute("SELECT id, username, password FROM student WHERE username LIKE \"%" + str(username) + "\"")
        return self.cursor.fetchall()

    def getTeacherLogin(self, email):
        sql = "SELECT id, email, password FROM teacher WHERE email = %s"
        get_email = (str(email), )
        self.cursor.execute(sql, get_email)
        return self.cursor.fetchall()

    def getUserToken(self, token):
        sql = "SELECT id, token FROM token WHERE token = %s"
        get_token = (str(token), )
        self.cursor.execute(sql, get_token)
        print("here")
        return self.cursor.fetchall()

    def insertToken(self, userId, token):
        deleted_old_token = "DELETE FROM token WHERE id = %s"
        del_input = (str(userId), )
        self.cursor.execute(deleted_old_token, del_input)

        sql = "INSERT INTO token VALUES (%s, %s)"
        input = (str(userId), str(token))
        self.cursor.execute(sql, input)
        return "ok"

    def createNewClass(self, teacher_email, class_name):
        self.cursor.execute("INSERT INTO class VALUES (teacher_email='" + str(teacher_email) + "', name='" + str(class_name) + "')")

