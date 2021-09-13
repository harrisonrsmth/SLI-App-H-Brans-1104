import mysql.connector as mysql
from dotenv import load_dotenv
import os

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

    def getStudentLogin(self, username):
        self.cursor.execute("SELECT id, username, password FROM student WHERE username LIKE \"%" + str(username) + "\"")
        return self.cursor.fetchall()

    def getTeacherLogin(self, email):
        sql = "SELECT id, email, password FROM teacher WHERE email = %s"
        get_email = (str(email), )
        self.cursor.execute(sql, get_email)
        return self.cursor.fetchall()

    def getTeacherInfo(self, user_id):
        sql = "SELECT fname FROM teacher WHERE id = %s"
        get_teacher_info = (str(user_id), )
        self.cursor.execute(sql, get_teacher_info)
        return self.cursor.fetchall()

    def getUserToken(self, token):
        print("entered sql")
        sql = "SELECT id, token FROM token WHERE token = %s"
        print("wrote sql script")
        get_token = (str(token), )
        print("got token")
        #################################################
        self.cursor.execute(sql, get_token)
        return self.cursor.fetchall()

    def insertToken(self, userId, token):
        deleted_old_token = "DELETE FROM token WHERE id = %s"
        del_input = (str(userId), )
        self.cursor.execute(deleted_old_token, del_input)

        sql = "INSERT INTO token VALUES (%s, %s)"
        input = (str(userId), str(token))
        self.cursor.execute(sql, input)
        return "ok"

    def createNewClass(self, teacher_id, class_name):

        insert_sql = "INSERT INTO class VALUES (%s, %s)"

        insert_input = (str(teacher_id), str(class_name))
        self.cursor.execute(insert_sql, insert_input)
        print("slslsls")
        return "good enough"

    def deleteToken(self, id):
        print("deleting...")
        sql = "DELETE FROM token WHERE id = %s"
        del_input = (str(id), )
        self.cursor.execute(sql, del_input)
        print("deleted!")

    def createTeacherAccount(self, email, password, fname, lname):
        self.cursor.execute("INSERT INTO teacher VALUES (NULL, \"%s\", \"%s\", \"%s\", \"%s\")"%(email, password, fname, lname))


    def getClasses(self, teacher_id):
        sql = "SELECT className FROM class WHERE %s"
        get_id = (str(teacher_id), )
        self.cursor.execute(sql, get_id)
        return self.cursor.fetchall()