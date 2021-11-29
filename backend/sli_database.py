# import mysql.connector as mysql
import datetime
from types import resolve_bases
from dotenv import load_dotenv
import os
from flaskext.mysql import MySQL
import pymysql
from datetime import date


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
    # Gets login information to verify password based on username input if username is present in database.
    #
    # Parameters:
    #   username: user's username
    # Returns:
    #   results: list of singular entry retrieved from database in the form [username, password, role]
    def getLogin(self, username):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        # print(username)
        cursor.execute("SELECT username, password, role, fname FROM `User` WHERE username LIKE \"%" + str(username) + "\"")
        result = cursor.fetchall()
        connection.close()
        # print("get login done")
        return result

    '''def getTeacherLogin(self, email):
        self.cursor = self.db.cursor()
        sql = "SELECT id, email, password FROM teacher WHERE email = %s"
        get_email = (str(email), )
        self.cursor.execute(sql, get_email)
        result = self.cursor.fetchall()
        self.cursor.close()
        return result'''

    # Gets user's first name to display in welcome message on dashboard.
    #
    # Parameters:
    #   username: user's username
    #
    # Returns:
    #   results: list of singular tuple entry retrieved from database in the form (fname)
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
        # print("entered sql")
        sql = "SELECT `user`, token_val FROM Token WHERE token_val = '{}'".format(token)
        # print("wrote sql script")
        #get_token = (str(token), )
        # print("got token")
        #################################################
        try:
            #self.cursor.execute(sql, get_token)
            cursor.execute(sql)
        except Exception as e:
            # print(e)
            return e
        # print("printing")
        result = cursor.fetchall()
        # print(result)
        connection.close()
        return result

    def insertToken(self, username, token):
        # print("ADB")
        connection = self.mysql.connect()
        cursor = connection.cursor()
        deleted_old_token = "DELETE FROM Token WHERE `user`=%s"

        del_input = (username, )
        cursor.execute("""DELETE FROM Token WHERE `user`=%s""", (username,))
        connection.commit()
        result = cursor.fetchall()
        # print(result)
        #print("insert new token")
        connection.close()

        connection = self.mysql.connect()
        cursor = connection.cursor()
        # print("insert new token")
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
        # print("created new class successful")
        connection.close()

    def deleteToken(self, username):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        # print("deleting...")
        sql = "DELETE FROM Token WHERE `user` = %s"
        del_input = (str(username), )
        cursor.execute(sql, del_input)
        # print("deleted!")
        connection.close()

    def createAccount(self, username, password, role, fname=None, lname=None):
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
        result = cursor.fetchall()
        connection.close()
        return result

    def getStudentsOfClass(self, teacher, class_name):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        # print("here")
        # print(teacher, class_name)
        sql = "SELECT student FROM InClass WHERE teacher LIKE %s AND class LIKE %s ORDER BY student ASC"

        input_sql = (str(teacher), str(class_name))

        # print("good")
        cursor.execute(sql, input_sql)
        # print("haha")
        result = cursor.fetchall()
        # print(type(result))

        connection.close()
        return result

    def addStudentToClass(self, teacher, class_name, student):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "INSERT INTO InClass VALUES (%s, %s, %s)"
        value = (str(teacher), str(class_name), str(student))
        cursor.execute(sql, value)
        connection.close()

    def logWork(self, username, project, sdg, date, hours, description):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "INSERT INTO `Work` (user, project, SDG, date, hours, description) VALUES (%s, %s, %s, %s, %s, %s)"
        inputs = (str(username), str(project), str(sdg), str(date), int(hours), str(description))
        # print(inputs)
        cursor.execute(sql, inputs)
        connection.close()

    '''
    Gets all campagins for the class that the given student is in.

    Parameters:
        student: username of student who's campaigns we want
    
    Returns:
        results: list of tuple entries retrieved from database in the form (campaign name, total_hours, start_date, due_date) 
        in ascending order of due date
    '''
    def studentGetCampaigns(self, student):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT name, total_hours, start_date, due_date FROM Campaign WHERE (teacher, class) in (SELECT teacher, class FROM InClass WHERE student LIKE %s) ORDER BY due_date desc"
        inputs = (str(student), )
        cursor.execute(sql, inputs)
        results = cursor.fetchall()
        connection.close()
        return results

    def getGoal(self, student):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT total_hours, target_date FROM Goal WHERE user like %s"
        inputs = (str(student), )
        cursor.execute(sql, inputs)
        results = cursor.fetchall()
        connection.close()
        return (results[0][0], str(results[0][1]))

    def createCampaign(self, teacher, class_name, name, total_hours, start_date, due_date):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "INSERT INTO Campaign VALUES (%s, %s, %s, %s, %s, %s)"
        inputs = (str(teacher), str(class_name), str(name), str(total_hours), str(start_date), str(due_date))
        cursor.execute(sql, inputs)
        connection.close()

    def createGoal(self, student, total_hours, target_date):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "DELETE FROM Goal WHERE user LIKE %s"
        inputs = (str(student), )
        cursor.execute(sql, inputs)
        sql = "INSERT INTO Goal VALUES (%s, %s, %s)"
        inputs = (str(student), str(total_hours), str(target_date))
        cursor.execute(sql, inputs)
        connection.close()

    def createPasswordLink(self, email, link):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "DELETE FROM ResetLink WHERE user LIKE %s"
        inputs = (str(email), )
        cursor.execute(sql, inputs)
        sql = "INSERT INTO ResetLink VALUES (%s, %s)"
        inputs = (str(email), link)
        cursor.execute(sql, inputs)
        connection.close()

    def getPasswordLink(self, link):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT user, link FROM ResetLink WHERE link LIKE %s"
        inputs = (link, )
        cursor.execute(sql, inputs)
        results = cursor.fetchall()
        connection.close()
        return results

    def resetPassword(self, username, password):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "UPDATE User SET password = %s WHERE username LIKE %s"
        inputs = (str(password), str(username))
        cursor.execute(sql, inputs)
        sql = "DELETE FROM ResetLink WHERE user LIKE %s"
        inputs = (str(username), )
        cursor.execute(sql, inputs)
        connection.close()

    # Gets all campaigns for a given class that a teacher owns to be displayed on the teacher's dashboard.
    #
    # Parameters:
    #   username: teacher's username
    #   className: name of teacher's class
    #
    # Returns:
    #   results: list of tuple entries retrieved from database in the form (campaign name, total_hours, start_date, due_date)
    #       in ascending order of due date
    def teacherGetCampaigns(self, username, className):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT name, total_hours, start_date, due_date FROM Campaign WHERE teacher LIKE %s AND class LIKE %s ORDER BY due_date desc"
        inputs = (str(username), str(className))
        cursor.execute(sql, inputs)
        results = cursor.fetchall()
        connection.close()
        return results

    # Gets total hours of logged work between the given start and due dates for a specific user.
    #
    # Parameters:
    #   start_date: earliest date threshold
    #   due_date: latest date threshold
    #   username: user whose total hours we want to retrieve
    #
    # Returns:
    #   results: list of tuple entries retrieved from database in the form (user, total_hours)
    def getStudentProgress(self, username, start_date, due_date):
        if not start_date:
            start_date = "1900-01-01"
        if not due_date:
            due_date = str(date.today())
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT user, sum(hours) FROM Work WHERE date BETWEEN %s AND %s AND user LIKE %s GROUP BY user;"
        inputs = (str(start_date), str(due_date), str(username))
        cursor.execute(sql, inputs)
        results = cursor.fetchall()
        print(results)
        connection.close()
        return results

    def getClassTotalHours(self, username, class_name, start_date, end_date):
        if not start_date:
            start_date = "1900-01-01"
        if not end_date:
            end_date = str(date.today())
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT sum(hours) FROM Work WHERE date BETWEEN %s AND %s AND user IN (SELECT student FROM InClass WHERE teacher LIKE %s AND class LIKE %s);"
        inputs = (str(start_date), str(end_date), str(username), str(class_name))
        cursor.execute(sql, inputs)
        results = cursor.fetchall()
        connection.close()
        return results
    
    def teacherGetRecentWork(self, username, class_name, start_date = "1900-01-01", end_date = date.today()):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT user, project, SDG, date, hours, description FROM Work WHERE user in (SELECT student FROM InClass WHERE teacher LIKE %s and class LIKE %s) and date BETWEEN %s and %s order by date desc;"
        inputs = (str(username), str(class_name), str(start_date), str(end_date))
        cursor.execute(sql, inputs)
        results = cursor.fetchall()
        connection.close()
        return results

    def studentGetRecentWork(self, username, start_date = "1900-01-01", end_date = date.today()):
        connection = self.mysql.connect()
        cursor = connection.cursor()
        sql = "SELECT user, project, SDG, date, hours, description FROM Work WHERE user like %s AND date BETWEEN %s and %s order by date;"
        inputs = (str(username), str(start_date), str(end_date))
        cursor.execute(sql, inputs)
        results = cursor.fetchall()
        connection.close()
        return results