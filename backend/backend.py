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

# info from .env for SLI email
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

# key value for encryption
key = b'mb_odrbq8UOpSh3Zd7mfsRTNLLIlnAuPJUB-FGZ_O7c='

# create database instance
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

#createUserTeacher(cursor, 0, "email_test", "pass_test", "f_test", "l_test")

# Authenticates login with username and password input from login screen. 
# This fetches the login information for the given username passed in and then
# verifies that the input password matches the decrypted password and the input
# role matches the fetched role. If login is authenticated, then the a token is
# generated for that user and it is passed back to the front end.
#
# input data format: 
#   "username": username entered on login screen
#   "password": password entered on login screen
#   "role": role entered on login screen
#
# response data format:
#   "code": 1 for success, 0 for failure
#   "token": token generated after login authenticated
#   "username": user that has been logged in
#   "isLoggedIn": set to true for frontend localStorage
#   "role": role of user logged in
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

# Gets user information based on token. Used for displaying name
# on dashboard and maintaining session after login. Also used to
# verify if a user is already logged in.
#
# input data format: 
#   "token": session token for a specific user
#
# response data format:
#   "username": user that is logged in
#   "isLoggedIn": set to true for frontend localStorage if already logged in, false otherwise
#   "fname": first name of user to display on dashboard
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



@app.route("/api/getClassesList", methods=['GET'])
@cross_origin()
def getClassesList():
    data = request.get_json(force=True)
    response = {}
    try:
        teacher = data["teacher"]
        result = db.getClasses(teacher)
        if result and len(result) > 0:
            response["code"] = 1
            response["classes"] = result
        else:
            response["code"] = 0
        return response
    except Exception as ex:
        print(ex)
        response["code"] = 0
        return response

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
    creatingLink = True

    # creating unique link extension for user to be added to database
    while creatingLink:
        try:
            allowed_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
            result = [allowed_chars[random.randint(0, len(allowed_chars) - 1)] for _ in range(32)]
            link = "".join(result)
            cipher_suite = Fernet(key)
            enc_link = str.encode(link)
            ciphered_link = cipher_suite.encrypt(enc_link)
            ciphered_link = bytes(ciphered_link).decode("utf-8")
            print(ciphered_link)
            db.createPasswordLink(data["email"], link)
            creatingLink = False
        except Exception as e:
            print(e)
            return
    try:
        port = 465  # For SSL
        smtp_server = "smtp.gmail.com"
        sender_email = EMAIL  # Enter your address
        receiver_email = data["email"]  # Enter receiver address
        password = EMAIL_PASSWORD
        
        # print(str_pwd)
        full_link = "http://127.0.0.1:3000/resetPassword/" + ciphered_link
        subject = "S.L.I. App Password Retrieval"
        text = "Hello!\n\nUse this link to reset your Seed & Lead Impact App password:\n{}\n\n-The Team at Seed & Lead Impact".format(full_link)
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

# given a link extension from the url, checks to see if it matches an extension in DB and if so, returns "username"
@app.route("/api/getResetLinkUser", methods=['POST'])
@cross_origin()
def getResetLinkUser():
    print("woo")
    data = request.get_json(force=True)
    print(data)
    response = {}
    link = data["link"]
    print(link)
    try:
        cipher_suite = Fernet(key)
        print("1")
        # decoded_link = bytes(link).decode("utf-8")
        print("2")
        encrypted_link = str.encode(link)
        print("3")
        unciphered_link = cipher_suite.decrypt(encrypted_link)
        print("3")
        unciphered_link = bytes(unciphered_link).decode("utf-8")
        print("4")
        print(unciphered_link)
        results = db.getPasswordLink(unciphered_link)
        if len(results) > 0:
            response["username"] = results[0][0]
            response["code"] = 1
        else:
            response["code"] = 0
    except:
        response["code"] = 0
    print(response)
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

# "campaignList" is a list of campgaigns in the form [class name, campaign name, total_hours, due_date] in ascending order
# no input data from frontend input necessary (gets username from localStorage)
# Retrieves the campaigns either for a specific student or a specific teacher depending on the role.
# If the user is a student, this will get the student's personal instance of each campaign for the class
# they are in. If the user is a teacher, this will get the overall instance of each campaign in all classes
# owned by the teacher.
#
# input data format:
#   "username": username of user who's campagins should be retrieved (from localStorage)
#   "role": role of the user, either "T" or "S" (from localStorage)
#
# response data format:
#   "code": 1 for success, 0 for failure
#   "campaignList": list of campaigns assigned to or owned by the user in format [campaign name, total_hours, due_date]

@app.route("/api/getCampaigns", methods = ['GET'])
@cross_origin()
def getCampaigns():
    data = request.get_json(force=True)
    response = {}
    try:
        if data["role"] == "T":
            campaigns = db.teacherGetCampaigns(data["username"])
        else:
            campaigns = db.studentGetCampaigns(data["username"])
        print(campaigns)
        response["campaignList"] = campaigns
        response["code"] = 1
    except:
        response["code"] = 0
    return response

# "goal" is the goal for the student in the form [total_hours, target_date]
# no input data from frontend input necessary (gets username from localStorage)
@app.route("/api/getGoal", methods = ['POST'])
@cross_origin()
def getGoal():
    data = request.get_json(force=True)
    response = {}
    try:
        goal = db.getGoal(data["username"])
        print(goal)
        response["goal"] = goal
        response["code"] = 1
    except:
        response["code"] = 0
    return response

# needed from frontend state: "username" can come from localStorage, "class" which is the class name,
# "name" of campaign, "total_hours", and "due_date"
@app.route("/api/createCampaign", methods = ['POST'])
@cross_origin()
def createCampaign():
    data = request.get_json(force=True)
    response = {}
    try:
        teacher = data["username"]
        class_name = data["class"]
        name = data["name"]
        total_hours = data["total_hours"]
        due_date = data["due_date"]
        db.createCampaign(teacher, class_name, name, total_hours, due_date)
        response["code"] = 1
    except:
        response["code"] = 0
    return response

# needed from frontend state: "username" can come from localStorage, "total_hours", and "target_date"
@app.route("/api/createGoal", methods = ['POST'])
@cross_origin()
def createGoal():
    data = request.get_json(force=True)
    response = {}
    try:
        student = data["username"]
        total_hours = data["total_hours"]
        target_date = data["target_date"]
        db.createGoal(student, total_hours, target_date)
        response["code"] = 1
    except:
        response["code"] = 0
    return response

@app.route("/api/setNewPassword", methods=['POST'])
@cross_origin()
def setNewPassword():
    print("1")
    data = request.get_json(force=True)
    print("2")
    response = {}
    print("3")
    try:
        username = data["username"]
        print("4")
        password = data["newPassword"]
        print("5")
        conf_password = data["conf_newPassword"]
        print("6")
        print(username)
        print(password)
        print(conf_password)
        if len(password) >= 8 and password == conf_password:
            db.resetPassword(username, password)
            response["code"] = 1
        else:
            response["code"] = 0
    except:
        response["code"] = 0
    return response