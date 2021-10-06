from cryptography.fernet import Fernet
from flask import Flask
import sli_database
from flask import request
import requests
from flask_cors import CORS, cross_origin
import random
from dotenv import load_dotenv
import os
from flaskext.mysql import MySQL
import pymysql
import ssl
import smtplib
import datetime

# import endpoint
from ClassesAdministrator.manage_students_account import manage_stud_accounts
from Authentication.authenticate import authenticate_endpoint

app = Flask(__name__)
CORS(app)

load_dotenv()
EMAIL = os.getenv("EMAIL")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
# SQL_HOST = os.getenv("SQL_HOST")
# SQL_USER = os.getenv('SQL_USER')
# SQL_PASSWORD = os.getenv('SQL_PASSWORD')

# app.config['MYSQL-HOST'] = SQL_HOST
# app.config['MYSQL_USER'] = SQL_USER
# app.config['MYSQL_PASSWORD'] = SQL_PASSWORD
# app.config['MYSQL_DB'] = "sli_database"
# app.config['MYSQL_AUTOCOMMIT'] = True

# mysql = MySQL()
# mysql = MySQL(app, host = SQL_HOST, user = SQL_USER, password = SQL_PASSWORD, db = "sli_database", autocommit = True, cursorclass = pymysql.cursors.DictCursor)
# mysql.init_app(app)

app.register_blueprint(manage_stud_accounts)
app.register_blueprint(authenticate_endpoint)


key = b'mb_odrbq8UOpSh3Zd7mfsRTNLLIlnAuPJUB-FGZ_O7c='

db = sli_database.DB(app)

'''def createUserStudent(username, password,
                      querynum=0,
                      updatenum=0,
                      connection_num=0):
    cipher_suite = Fernet(key)
    password = str.encode(password)
    ciphered_password = cipher_suite.encrypt(password)
    ciphered_password = bytes(ciphered_password).decode("utf-8")

    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO student VALUES (\"%s\", \"%s\")"%(username, ciphered_password))
        print("Student account successfully created.")
    except Exception as Ex:
        print("Error creating Student account: %s"%(Ex))'''

#createUserStudent(cursor, "user_test", "pass_test")


def getDB():
    return mysql


#createUserTeacher(cursor, 0, "email_test", "pass_test", "f_test", "l_test")

@app.route("/api/authenticateLogin", methods=['POST'])
@cross_origin()
def login():
    data = request.get_json(force=True)
    print(str(data) + " ,,,,,")
    role = data["role"]
    username = data["username"]
    password = data["password"]
    response = {}
    records = db.getLogin(username)
    if len(records) > 0:
        print(records)
        # ignore encoding for testing
        """
        cipher_suite = Fernet(key)
        encrypted_pwd = str.encode(records[0][1])
        unciphered_text = cipher_suite.decrypt(encrypted_pwd)
        fetched = bytes(unciphered_text).decode("utf-8")
        """
        #print(password, str_pwd)
        #get_password = records[0][1]
        #if password == get_password:
        str_pwd = bytes(records[0][1]).decode("utf-8")
        #str_pwd = records[0][1]
        print(password)
        print(str_pwd)
        if password == str_pwd and role == records[0][2]:
            token = generateToken(32)
            username = records[0][0]
            print(username, token, "test TOken")
            setUserToken(username, token)
            response["code"] = 1
            response["token"] = token
            response["username"] = username
            response["isLoggedIn"] = True
            response["role"] = role
            print(response)
            return response # success
        else:
            return {"code": 0} # failure- password incorrect
    else:
        return {"code": 0} # failure- email doesn't exist

@app.route("/api/getCurrentUserToken", methods=['POST'])
@cross_origin()
def getUserToken():
    data = request.get_json(force=True)
    response = {}
    token = data["token"] if "token" in data else None
    curr_user, user_info = None, None
    try:
        # query user from token
        if token:
            curr_user = db.getUserToken(token)

        # query information of user from user
        if curr_user and len(curr_user) > 0:
            user_name = curr_user[0][0]
            user_info = db.getUserInfo(user_name)

            # user already logged in with token
            response["isLoggedIn"] = True
            response["username"] = user_name
        else:
            response["isLoggedIn"] = False

        # generate the response
        if user_info and len(user_info) > 0:
            response["fname"] = user_info[0][0]

        return response

    except Exception as ex:
        print(ex)



@app.route("/api/getClassesList", methods=['POST'])
@cross_origin()
def getClassesList():
    data = request.get_json(force=True)
    response = {}
    try:
        teacher = data["teacher"]
        result = db.getClasses(teacher)
        if result and len(result) > 0:
            response["classes"] = result
    except Exception as ex:
        print(ex)

@app.route("/api/getStudentsFromClass", methods=['POST'])
@cross_origin()
def getStudentsFromClass():
    data = request.get_json(force=True)
    print(data)
    response = {}
    try:
        if data and "className" in data and "teacher" in data:
            class_name = data["className"]
            teacher = data["teacher"]
            results = db.getStudentsOfClass(teacher, class_name)
            if results:
                print(results)
                response["studentList"] = [student[0] for student in results]
            print(response)
            return response
        return {"invalid class or teacher"}
    except Exception as ex:
        print(ex)


@app.route("/api/createAccount", methods=['POST'])
@cross_origin()
def createAccount():
    data = request.get_json(force=True)
    print(data)
    if data["password"] == data["conf_password"] and len(data["password"]) >= 8:
        try:
            create_result = createUser(data["username"], data["password"], data["role"], data["fname"], data["lname"])
            if data["role"] == "S" and create_result == "success" and "teacher" in data and "className" in data:
                db.addStudentToClass(data["teacher"], data["className"], data["username"])
            return {"code": 1}
        except:
            return {"code": 2}
    else:
        return {"code": 0}


def createUser(username, password, role, fname, lname,
               querynum=0,
               updatenum=0,
               connection_num=0):
    '''
    cipher_suite = Fernet(key)
    password = str.encode(password)
    ciphered_password = cipher_suite.encrypt(password)
    ciphered_password = bytes(ciphered_password).decode("utf-8")
    '''

    try:
        result = db.createAccount(username, password, role, fname, lname)
        print(result)
        print("Account successfully created.")
        return result
    except Exception as Ex:
        print("Error creating account: %s"%(Ex))






@app.route("/api/createNewClass", methods=['POST'])
@cross_origin()
def createClass():
    try:
        data = request.get_json(force=True)
        response = {}
        print(data)
        role = data["role"]
        username = data["username"]
        class_name = data["className"]
        print(role, username, class_name)
        # role "S" = student and "T" = teacher
        if role == "T" and username and class_name:
            print("adsfdf")
            records = db.createNewClass(username, class_name)
            response["status"] = "success"
            response["code"] = 1
        return response

    except Exception as ex:
        return {"code": 0}

@app.route("/api/sendPasswordEmail", methods=['POST'])
def sendPasswordEmail():
    data = request.get_json(force=True)
    print(data)
    try:
        port = 465  # For SSL
        smtp_server = "smtp.gmail.com"
        sender_email = EMAIL  # Enter your address
        receiver_email = data["email"]  # Enter receiver address
        password = EMAIL_PASSWORD
        results = db.getLogin(data["email"])
        str_pwd = bytes(results[0][1]).decode("utf-8")

        name = results[0][3]
        # print(str_pwd)
        subject = "S.L.I. App Password Retrieval"
        text = "Hi {},\n\nYour Seed & Lead Impact App password is: {}\n\n-The Team at Seed & Lead Impact".format(name, str_pwd)
        message = "Subject: {}\n\n{}".format(subject, text)
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
            print("check forgot password")
            server.login(sender_email, password)
            print("check here")
            server.sendmail(sender_email, receiver_email, message)
        response = {"code": 200}
    except Exception as e:
        print(e)
        response = {"code": 500}
    return response



@app.route("/hello", methods=['POST'])
def getHello():
    data = request.get_json(force=True)
    print(data)
    email = str(data["email"])
    name = str(data["name"])
    print(email, name)
    records = db.createNewClass(email, name)
    print(records)
    return {"sucess": data}

@app.route("/api/testLogin", methods=['POST'])
@cross_origin()
def getTestLogin():
    data = request.get_json(force=True)
    username = str(data["username"])
    password = str(data["password"])
    result = db.getTeacherLogin(username)
    get_mail = result[0][0]
    get_password = result[0][1]
    print(result)
    if get_mail == username and get_password == password:
        return {"code": 1}
    return {"code": 0}

@app.route("/api/logWork", methods=['POST'])
@cross_origin()
def logWork():
    data = request.get_json(force=True)
    #data["date"] = datetime.strptime(data["date"],'%Y%m%d')
    print(data)
    try:
        db.logWork(data)
        return {"code": 1} #success
    except Exception as ex:
        print(ex)
        return {"code": 0} #id not in database

@app.route("/api/logout", methods=['POST'])
@cross_origin()
def logout():
    data = request.get_json(force=True)
    print(data)
    username = data["username"]
    print(username)
    try:
        print("deleting token")
        db.deleteToken(username)
        return {"code": 1} #success
    except Exception as ex:
        print(ex)
        return {"code": 0} #id not in database

# this is temporary token generating algorithm
# need to use library later
def generateToken(length):
    allowed_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    result = [allowed_chars[random.randint(0, len(allowed_chars) - 1)] for _ in range(length)]
    return "".join(result)

def setUserToken(username, token):
    try:
        if username and token:
            record = db.insertToken(username, token)
            print("insert token sucessful")
    except Exception as ex:
        return ex





