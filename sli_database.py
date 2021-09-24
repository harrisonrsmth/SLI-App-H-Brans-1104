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
        self.cursor.close()

    def getLogin(self, username):
        self.cursor = self.db.cursor()
        self.cursor.execute("SELECT username, password, role FROM `User` WHERE username LIKE \"%" + str(username) + "\"")
        result = self.cursor.fetchall()
        self.cursor.close()
        return result

    '''def getTeacherLogin(self, email):
        self.cursor = self.db.cursor()
        sql = "SELECT id, email, password FROM teacher WHERE email = %s"
        get_email = (str(email), )
        self.cursor.execute(sql, get_email)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result'''

    def getUserInfo(self, username):
        self.cursor = self.db.cursor()
        sql = "SELECT fname FROM `User` WHERE username = %s"
        get_teacher_info = (str(username), )
        self.cursor.execute(sql, get_teacher_info)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result

    def getUserToken(self, token):
        self.db.close()
        self.db = mysql.connect(
            host = SQL_HOST,
            user = SQL_USER,
            passwd = SQL_PASSWORD,
            database = "sli_database",
            autocommit = True
        )
        self.cursor = self.db.cursor()
        print("entered sql")
        sql = "SELECT `user`, token_val FROM Token WHERE token_val = '{}'".format(token)
        print("wrote sql script")
        #get_token = (str(token), )
        print("got token")
        #################################################
        try:
            #self.cursor.execute(sql, get_token)
            self.cursor.execute(sql)
        except Exception as e:
            print(e)
            return e
        print("printing")
        result = self.cursor.fetchall()
        self.cursor.close()
        return result

    def insertToken(self, username, token):
        self.cursor = self.db.cursor()
        deleted_old_token = "DELETE FROM Token WHERE `user` = %s"
        del_input = (str(username), )
        self.cursor.execute(deleted_old_token, del_input)

        sql = "INSERT INTO Token VALUES (%s, %s)"
        input = (str(username), str(token))
        self.cursor.execute(sql, input)
        self.cursor.close()
        return "ok"

    def createNewClass(self, teacher, class_name):
        self.cursor = self.db.cursor()

        insert_sql = "INSERT INTO Class VALUES (%s, %s)"

        insert_input = (str(teacher), str(class_name))
        self.cursor.execute(insert_sql, insert_input)
        print("slslsls")
        self.cursor.close()
        return "good enough"

    def deleteToken(self, username):
        self.cursor = self.db.cursor()
        print("deleting...")
        sql = "DELETE FROM Token WHERE username = %s"
        del_input = (str(username), )
        self.cursor.execute(sql, del_input)
        print("deleted!")
        self.cursor.close()

    def createAccount(self, username, password, role, fname, lname):
        self.cursor = self.db.cursor()
        sql = "INSERT INTO `User` VALUES (%s, %s, %s, %s, %s)"
        inputs = (str(username), str(password), str(role), str(fname), str(lname))
        self.cursor.execute(sql, inputs)
        self.cursor.close()

    def getClasses(self, teacher):
        self.cursor = self.db.cursor()
        sql = "SELECT name FROM Class WHERE teacher = %s"
        get_id = (str(teacher), )
        self.cursor.execute(sql, get_id)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result