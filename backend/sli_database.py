# import mysql.connector as mysql
from dotenv import load_dotenv
import os
from flaskext.mysql import MySQL
import pymysql


load_dotenv()
SQL_HOST = os.getenv("SQL_HOST")
SQL_USER = os.getenv('SQL_USER')
SQL_PASSWORD = os.getenv('SQL_PASSWORD')

class DB:

    def __init__(self, app):
        # app.config['MYSQL-HOST'] = SQL_HOST
        # app.config['MYSQL_USER'] = SQL_USER
        # app.config['MYSQL_PASSWORD'] = SQL_PASSWORD
        # app.config['MYSQL_DB'] = "sli_database"
        # app.config['MYSQL_AUTOCOMMIT'] = True
        # app.config['MYSQL_AUTH_PLUGIN'] = "mysql_native_password"

        self.mysql = MySQL(app, host = SQL_HOST, user = SQL_USER, password = SQL_PASSWORD, db = "sli_database", autocommit = True)
        # self.mysql.init_app(app)
        self.db = self.mysql.connect()


        self.cursor = self.db.cursor()
        self.cursor.close()
    """
    def create_connection(self):
        return pymysql.connect(
            host=SQL_HOST,
            db='sli_database',
            user=SQL_USER,
            password=SQL_PASSWORD,
            cursorclass=pymysql.cursors.DictCursor
        )
    """

    def getLogin(self, username):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        print(username)
        cursor.execute("SELECT username, password, role FROM `User` WHERE username LIKE \"%" + str(username) + "\"")
        connection.close()
        print("get login done")
        return cursor.fetchall()

    '''def getTeacherLogin(self, email):
        self.cursor = self.db.cursor()
        sql = "SELECT id, email, password FROM teacher WHERE email = %s"
        get_email = (str(email), )
        self.cursor.execute(sql, get_email)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result'''

    def getUserInfo(self, username):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT fname FROM `User` WHERE username = %s"
        get_teacher_info = (str(username), )
        cursor.execute(sql, get_teacher_info)
        result = cursor.fetchall()
        connection.close()
        return result

    def getUserToken(self, token):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        print("entered sql")
        sql = "SELECT `user`, token_val FROM Token WHERE token_val = '{}'".format(token)
        print("wrote sql script")
        #get_token = (str(token), )
        print("got token")
        #################################################
        try:
            #self.cursor.execute(sql, get_token)
            cursor.execute(sql)
        except Exception as e:
            print(e)
            return e
        print("printing")
        result = cursor.fetchall()
        print(result)
        connection.close()
        return result

    def insertToken(self, username, token):
        print("ADB")
        connection = self.mysql.connect()
        cursor = connection.cursor()
        deleted_old_token = "DELETE FROM Token WHERE `user`=%s"

        del_input = (username, )
        cursor.execute("""DELETE FROM Token WHERE `user`=%s""", (username,))
        connection.commit()
        result = cursor.fetchall()
        print(result)
        #print("insert new token")
        connection.close()

        connection = self.mysql.connect()
        cursor = connection.cursor()
        print("insert new token")
        sql = "INSERT INTO Token VALUES (%s, %s)"
        input = (str(username), str(token))
        cursor.execute(sql, input)

        connection.close()
        return "ok"

    def createNewClass(self, teacher, class_name):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        insert_sql = "INSERT INTO Class VALUES (%s, %s)"
        insert_input = (str(teacher), str(class_name))
        cursor.execute(insert_sql, insert_input)
        print("created new class successful")
        connection.close()
        return "ok"

    def deleteToken(self, username):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        print("deleting...")
        sql = "DELETE FROM Token WHERE `user` = %s"
        del_input = (str(username), )
        cursor.execute(sql, del_input)
        print("deleted!")
        connection.close()

    def createAccount(self, username, password, role, fname, lname):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "INSERT INTO `User` VALUES (%s, %s, %s, %s, %s)"
        inputs = (str(username), str(password), str(role), str(fname), str(lname))
        cursor.execute(sql, inputs)
        connection.close()
        return "success"

    def getClasses(self, teacher):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT name FROM Class WHERE teacher = %s"
        get_id = (str(teacher), )
        cursor.execute(sql, get_id)
        result = self.cursor.fetchall()
        connection.close()
        return result

    def getStudentsOfClass(self, teacher, class_name):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        print("here")
        sql = "SELECT student FROM InClass WHERE teacher LIKE %s AND class LIKE %s"
        input_sql = (str(teacher), str(class_name))
        print("good")
        cursor.execute(sql, input_sql)
        print("haha")
        result = cursor.fetchall()
        print(result)
        connection.close()
        return result



    def addStudentToClass(self, teacher, class_name, student):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "INSERT INTO InClass VALUES (%s, %s, %s)"
        value = (str(teacher), str(class_name), str(student))
        cursor.execute(sql, value)
        connection.close()

