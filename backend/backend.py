import datetime
from types import resolve_bases
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
from datetime import date, timedelta
import json

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
key = bytes(os.getenv("ENCRYPTION_KEY"), "utf-8")

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

'''
Authenticates login with username and password input from login screen. 
This fetches the login information for the given username passed in and then
verifies that the input password matches the decrypted password and the input
role matches the fetched role. If login is authenticated, then the a token is
generated for that user and it is passed back to the front end.

input data format: 
    "username": username entered on login screen
    "password": password entered on login screen
    "role": role entered on login screen

response data format:
    "code": 1 for success, 0 for failure
    "token": token generated after login authenticated
    "username": user that has been logged in
    "isLoggedIn": set to true for frontend sessionStorage
    "role": role of user logged in
'''
@app.route("/api/authenticateLogin", methods=['POST'])
@cross_origin()
def login():
    data = request.get_json(force=True)
    # print(str(data) + " ,,,,,")
    username = data["username"]
    password = data["password"]
    response = {}
    records = db.getLogin(username)
    if len(records) > 0:
        # print(records)
        # ignore encoding for testing
        """
        cipher_suite = Fernet(key)
        encrypted_pwd = str.encode(records[0][1])
        unciphered_text = cipher_suite.decrypt(encrypted_pwd)
        fetched = bytes(unciphered_text).decode("utf-8")
        """
        cipher_suite = Fernet(key)
        decoded_password = bytes(records[0][1]).decode("utf-8")
        encrypted_pwd = str.encode(decoded_password)
        unciphered_text = cipher_suite.decrypt(encrypted_pwd)
        fetched = bytes(unciphered_text).decode("utf-8")
        #print(password, str_pwd)
        #get_password = records[0][1]
        #if password == get_password:
        # str_pwd = bytes(records[0][1]).decode("utf-8")
        #str_pwd = records[0][1]
        # print(password)
        # print(str_pwd)
        if password == fetched:
            token = generateToken(32)
            username = records[0][0]
            # print(username, token, "test TOken")
            setUserToken(username, token)
            response["code"] = 1
            response["token"] = token
            response["username"] = username
            response["isLoggedIn"] = True
            response["role"] = records[0][2]
            # print(response)
            return json.dumps(response) # success
        else:
            return json.dumps({"code": 0}) # failure- password incorrect
    else:
        return json.dumps({"code": 0}) # failure- email doesn't exist

'''
Gets user information based on token. Used for displaying name
on dashboard and maintaining session after login. Also used to
verify if a user is already logged in.

input data format: 
    "token": session token for a specific user

response data format:
    "username": user that is logged in
    "isLoggedIn": set to true for frontend sessionStorage if already logged in, false otherwise
    "fname": first name of user to display on dashboard
'''
@app.route("/api/getCurrentUserToken", methods=['GET'])
@cross_origin()
def getUserToken():
    # data = request.get_json(force=True)
    response = {}
    # token = data["token"] if "token" in data else None
    token = request.args.get("token", default=None)
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
        response["code"] = 1
        return json.dumps(response)

    except Exception as ex:
        # print(ex)
        return json.dumps({"code": 0})

'''
Used for teachers to get a list of their classes to be displayed in dropdown menus
to select a particular class.

input data format:
    "username": username of teacher who's classes we want

output data format:
    "code": 1 for success, 0 for failure
    "classes": list of all classes owned by the teacher
'''
@app.route("/api/getClassesList", methods=['GET'])
@cross_origin()
def getClassesList():
    # data = request.get_json(force=True)
    response = {}
    try:
        teacher = request.args.get("username", default=None)
        # username = data["username"]
        result = db.getClasses(teacher)
        if result and len(result) > 0:
            response["code"] = 1
            response["classes"] = result
        else:
            response["code"] = 0
        return json.dumps(response)
    except Exception as ex:
        # print(ex)
        response["code"] = 0
        return json.dumps(response)

'''
Used by teachers to get the complete list of students in a given class that the teacher
owns. This information is displayed on the manage classes page.

input data format:
    "current_class": specific class that we want a student list for
    "username": username of teacher who owns the class

output data format:
    "code": 1 for success, 0 for failure
    "studentList": list of student usernames in the given class
'''
@app.route("/api/getStudentsFromClass", methods=['GET'])
@cross_origin()
def getStudentsFromClass():
    # data = request.get_json(force=True)
    # print(data)
    response = {}
    try:
        current_class = request.args.get("current_class", default=None)
        teacher = request.args.get("username", default=None)
        # print("#########")
        # print(current_class)
        # print(teacher)
        if teacher and current_class:
            # class_name = data["currentClass"]
            # teacher = data["teacher"]
            results = db.getStudentsOfClass(teacher, current_class)
            if results:
                # print(results)
                response["studentList"] = [student[0] for student in results]
            # print(response)
            response["code"] = 1
            return json.dumps(response)
        return json.dumps({"code": 0})
    except Exception as ex:
        # print(ex)
        return json.dumps({"code": 0})

'''
Creates a student or teacher account depending on the role passed in. Teacher
accounts are created from create account page, student accounts are made from 
add student to class page. If the user is a student, the new account is also added
to the teacher's class that is passed in. If the new user is a teacher, after creating
the account, the user will be logged in.

input data format:
    "role": role of new user
    "username": username of new user
    "password": password of new user
    "conf_password": confirmation of new password
    "teacher": if role is "S", username of teacher who is creating the account
    "current_class": if role is "S", name of class which the student will be added to

output data format:
    "code": 1 for success, 2 for invalid login info, 0 for failure
    "username": if role is "T", username of user that has been created/logged in
    "token": if role is "T", token of user that has been logged in
    "isLoggedIn": if role is "T", whether or not user has been logged in
    "role": if role is "T", role of user that has been logged in
'''
@app.route("/api/createAccount", methods=['POST'])
@cross_origin()
def createAccount():
    data = request.get_json(force=True)
    # print(data)
    response = {}
    try:
        if data["password"] == data["conf_password"] and len(data["password"]) >= 8:
            cipher_suite = Fernet(key)
            enc_pwd = str.encode(data["password"])
            ciphered_pwd = cipher_suite.encrypt(enc_pwd)
            ciphered_pwd = bytes(ciphered_pwd).decode("utf-8")
            try:
                if data["role"] == "S":
                    db.createAccount(data["username"], ciphered_pwd, data["role"])
                    db.addStudentToClass(data["teacher"], data["current_class"], data["username"])
                else:
                    db.createAccount(data["username"], ciphered_pwd, data["role"], data["fname"], data["lname"])
                    token = generateToken(32)
                    username = data["username"]
                    # print(username, token, "test TOken")
                    setUserToken(username, token)
                    response["token"] = token
                    response["username"] = username
                    response["isLoggedIn"] = True
                    response["role"] = data["role"]
                response["code"] = 1
                return json.dumps(response)
            except:
                return json.dumps({"code": 2})
        else:
            return json.dumps({"code": 0})
    except:
        response["code"] = 0
        return json.dumps(response)

# def createUser(username, password, role, fname, lname,
#                querynum=0,
#                updatenum=0,
#                connection_num=0):
#     '''
#     cipher_suite = Fernet(key)
#     password = str.encode(password)
#     ciphered_password = cipher_suite.encrypt(password)
#     ciphered_password = bytes(ciphered_password).decode("utf-8")
#     '''

#     try:
#         result = db.createAccount(username, password, role, fname=None, lname=None)
#         print(result)
#         print("Account successfully created.")
#         return json.dumps(result)
#     except Exception as Ex:
#         print("Error creating account: %s"%(Ex))

'''
Used by teachers to create a new class. This can be found from the manage classes page.

input data format:
    "username": username of teacher who is creating class
    "class_name": name of new class

output data format:
    "code": 1 for success, 0 for failure
'''
@app.route("/api/createNewClass", methods=['POST'])
@cross_origin()
def createClass():
    try:
        data = request.get_json(force=True)
        response = {}
        # print(data)
        username = data["username"]
        class_name = data["class_name"]
        # print(username, class_name)
        # role "S" = student and "T" = teacher
        if username and class_name:
            # print("adsfdf")
            db.createNewClass(username, class_name)
            response["code"] = 1
        return json.dumps(response)

    except Exception as ex:
        return json.dumps({"code": 0})

'''
Generates an encrypted link extension that is associated to the specific teacher
and sends a valid reset password link to the teacher's email. The associated link 
extension and username are also added to the database for later retrieval.

input data format:
    "email": email of teacher who is resetting their password.

output data format:
    "code": 1 for success, 0 for failure
'''
@app.route("/api/sendPasswordEmail", methods=['POST'])
def sendPasswordEmail():
    data = request.get_json(force=True)
    # print(data)
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
            # print(ciphered_link)
            db.createPasswordLink(data["email"], link)
            creatingLink = False
        except Exception as e:
            # print(e)
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
            # print("check forgot password")
            server.login(sender_email, password)
            # print("check here")
            server.sendmail(sender_email, receiver_email, message)
        response = {"code": 1}
    except Exception as e:
        # print(e)
        response = {"code": 0}
    return json.dumps(response)

'''
Gets the associated teacher's username given the URL extension for resetting their password.

input data format:
    "link": url extension associated with the intended user

output data format:
    "code": 1 for success, 0 for failure
    "username": username of teacher associated with the given link extension
'''
@app.route("/api/getResetLinkUser", methods=['GET'])
@cross_origin()
def getResetLinkUser():
    # data = request.get_json(force=True)
    # print(data)
    response = {}
    link = request.args.get("link", default=None)
    # print(link)
    try:
        cipher_suite = Fernet(key)
        # decoded_link = bytes(link).decode("utf-8")
        encrypted_link = str.encode(link)
        unciphered_link = cipher_suite.decrypt(encrypted_link)
        unciphered_link = bytes(unciphered_link).decode("utf-8")
        # print(unciphered_link)
        results = db.getPasswordLink(unciphered_link)
        if len(results) > 0:
            response["username"] = results[0][0]
            response["code"] = 1
        else:
            response["code"] = 0
    except:
        response["code"] = 0
    # print(response)
    return json.dumps(response)

'''
Allows students to log work they have completed and adds it to the database to be
counted towards campaigns and goals.

input data format:
    "username": username of student logging work
    "project": name of the work completed
    "SDG": SDG that the work applies to
    "date": date the work was completed
    "hours": total hours of work
    "description": short description of work completed

output data format:
    "code": 1 for success, 0 for failure
'''
@app.route("/api/logWork", methods=['POST'])
@cross_origin()
def logWork():
    data = request.get_json(force=True)
    #data["date"] = datetime.strptime(data["date"],'%Y%m%d')
    # print(data)
    try:
        username = data["username"]
        project = data["project"]
        sdg = data["SDG"]
        work_date = data["date"]
        hours = data["hours"]
        description = data["description"]
        db.logWork(username, project, sdg, work_date, hours, description)
        return json.dumps({"code": 1}) #success
    except Exception as ex:
        # print(ex)
        return json.dumps({"code": 0}) #id not in database

'''
Logs out a user that is currently logged in. Deletes token and session information
from the database and sessionStorage. A user is also logged out when they close the 
window.

input data format:
    "username": username of user logging out.

output data format:
    "code": 1 for success, 0 for failure
'''
@app.route("/api/logout", methods=['POST'])
@cross_origin()
def logout():
    data = request.get_json(force=True)
    # print(data)
    username = data["username"]
    # print(username)
    try:
        # print("deleting token")
        db.deleteToken(username)
        return json.dumps({"code": 1}) #success
    except Exception as ex:
        # print(ex)
        return json.dumps({"code": 0}) #id not in database

# this is temporary token generating algorithm
# need to use library later
'''
Helper function to generate a token for a user

parameters:
    length: length of token (32)

returns:
    valid token to authenticate user login
'''
def generateToken(length):
    allowed_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    result = [allowed_chars[random.randint(0, len(allowed_chars) - 1)] for _ in range(length)]
    return "".join(result)

'''
Helper function to set the token for the given user in the database.

parameters:
    username: username of user who's token is generated
    token: token for the given user
'''
def setUserToken(username, token):
    try:
        if username and token:
            record = db.insertToken(username, token)
            # print("insert token sucessful")
    except Exception as ex:
        return ex

'''
Retrieves the campaigns either for a specific student or a specific teacher depending on the role.
If the user is a student, this will get the student's personal instance of each campaign for the class
they are in. If the user is a teacher, this will get the overall instance of each campaign in all classes
owned by the teacher.

input data format:
    "username": username of user who's campagins should be retrieved (from sessionStorage)
    "role": role of the user, either "T" or "S" (from sessionStorage)

response data format:
    "code": 1 for success, 0 for failure
    "campaignList": list of campaigns assigned to or owned by the user in format [campaign_name, total_hours, start_date, due_date]
'''
@app.route("/api/getCampaigns", methods = ['GET'])
@cross_origin()
def getCampaigns():
    # data = request.get_json(force=True)
    role = request.args.get("role", default=None)
    username = request.args.get("username", default=None)
    current_class = request.args.get("current_class", default=None)
    response = {}
    try:
        if role == "T":
            campaigns = db.teacherGetCampaigns(username, current_class)
        else:
            campaigns = db.studentGetCampaigns(username)
        # print(campaigns)
        response["campaignList"] = campaigns
        response["code"] = 1
    except:
        response["code"] = 0
    return json.dumps(response, indent=4, sort_keys=True, default=str)

'''
Gets a student's goal to be displayed on the dashboard. A student will only have one
goal at a time.

input data format:
    "username": username of student who's goal we want

output data format:
    "code": 1 for success, 0 for failure
    "goal": goal of the student in the form [total_hours, target_date]
'''
@app.route("/api/getGoal", methods = ['GET'])
@cross_origin()
def getGoal():
    # data = request.get_json(force=True)
    username = request.args.get("username", default=None)
    response = {}
    try:
        goal = db.getGoal(username)
        # print(goal)
        response["goal"] = goal
        response["code"] = 1
    except:
        response["code"] = 0
    return json.dumps(response)

'''
Used by teachers to create a campaign for a class that they own. The campaign is then
visible by every student in that class.

input data format:
    "username": username of teacher creating the campaign
    "current_class": class name that the campaign will be assigned to
    "name": name of the campaign
    "hours": total hours required to complete the campaign
    "start_date": date the the campaign starts
    "due_date": due date of the campaign

output data format:
    "code": 1 for success, 0 for failure
'''
@app.route("/api/createCampaign", methods = ['POST'])
@cross_origin()
def createCampaign():
    data = request.get_json(force=True)
    # print(data)
    response = {}
    try:
        username = data["username"]
        current_class = data["current_class"]
        name = data["name"]
        total_hours = data["hours"]
        start_date = data["start_date"]
        due_date = data["due_date"]
        db.createCampaign(username, current_class, name, total_hours, start_date, due_date)
        response["code"] = 1
    except:
        response["code"] = 0
    return json.dumps(response)

# needed from frontend state: "username" can come from sessionStorage, "total_hours", and "target_date"
'''
Used by students to set a goal for themselves. A student will only have one goal
at a time. If a student already has a goal and sets a new one, the old goal is
overwritten.

input data format:
    "username": username of the student setting the goal
    "total_hours": total hours to achieve the goal
    "target_date": target date for the goal to be completed by

output data format:
    "code": 1 for success, 0 for failure
'''
@app.route("/api/createGoal", methods = ['POST'])
@cross_origin()
def createGoal():
    data = request.get_json(force=True)
    response = {}
    try:
        username = data["username"]
        total_hours = data["total_hours"]
        target_date = data["target_date"]
        db.createGoal(username, total_hours, target_date)
        response["code"] = 1
    except:
        response["code"] = 0
    return json.dumps(response)

'''
Used by teachers once they receive a reset password link to reset their password.
Replaces old password in the database with the new password.

input data format:
    "username": username of teacher resetting their password
    "new_password": newly reset password
    "conf_new_password": confirmation of new password

output data format:
    "code": 1 for success, 0 for failure
'''
@app.route("/api/setNewPassword", methods=['POST'])
@cross_origin()
def setNewPassword():
    data = request.get_json(force=True)
    response = {}
    try:
        username = data["username"]
        password = data["new_password"]
        conf_password = data["conf_new_password"]
        if len(password) >= 8 and password == conf_password:
            db.resetPassword(username, password)
            response["code"] = 1
        else:
            response["code"] = 0
    except:
        response["code"] = 0
    return json.dumps(response)

'''
Gets current progress for either a specific student or all students in a specific class, depending on 
user role. Queries database for each student for each campaign and calculates the percentage of completion
of that student for the given campaign. Progess for campaigns is calculated by summing the total hours
of work completed in the window set by the start and due dates of each campaign.

input data format: 
    "role": role of user, either "T" or "S" (from sessionStorage)
    "username": username of student whose progress we want or of teacher whose class we want
    "class": present if role is "T", name of class we want to see progress of
    "student_filter": 

output data format:
    "code": 1 for success, 0 for failure
    "progress": list of all student progress for all campaigns of class in the form of
        [[campaign1, progress1], [campaign2, progess2], ...]
        with campaign# in the form of
            [class_name, campaign_name, total_hours, start_date, due_date]
        and progress# in the form of
            [[student1], [student2], ...]
            with student# in the form of
                [username, hours_complete, percentage_complete]
        example:
        [
            [
                [
                    "campaign1",
                    5,
                    "Tue, 02 Nov 2021 00:00:00 GMT",
                    "Sat, 06 Nov 2021 00:00:00 GMT"
                ],
                [
                    [
                        "student1",
                        3,
                        "60%"
                    ],
                    [
                        "student2",
                        3,
                        "60%"
                    ]
                ]
            ],
            [
                [
                    "campaign2",
                    10,
                    "Wed, 03 Nov 2021 00:00:00 GMT",
                    "Sun, 07 Nov 2021 00:00:00 GMT"
                ],
                [
                    [
                        "student1",
                        3,
                        "30%"
                    ],
                    [
                        "student2",
                        3,
                        "30%"
                    ]
                ]
            ]
        ]
'''
@app.route("/api/getProgress", methods=['GET'])
@cross_origin()
def getProgress():
    # data = request.get_json(force=True)
    # print(data)
    role = request.args.get("role", default=None)
    username = request.args.get("username", default=None)
    current_class = request.args.get("current_class", default=None)
    student_filter = request.args.get("student_filter", default=None)
    response = {}
    try:
        total_progress = []
        if role == "T":
            # teacher is viewing progress
            if student_filter:
                # teacher views progress of specific student
                campaigns = list(db.studentGetCampaigns(student_filter))
                for campaign in campaigns:
                    campaign_progress = [[campaign[0], campaign[1], str(campaign[2]), str(campaign[3])], []]
                    progress = db.getStudentProgress(student_filter, campaign[2], campaign[3])
                    progress = calculateProgress(progress, student_filter, campaign[2])
                    campaign_progress[1].append(progress)
                    total_progress.append(campaign_progress)
            else:
                # teacher views progress of entire class
                students = list(db.getStudentsOfClass(username, current_class))
                campaigns = list(db.teacherGetCampaigns(username, current_class))
                for campaign in campaigns:
                    campaign_progress = [[campaign[0], campaign[1], str(campaign[2]), str(campaign[3])], []]
                    for student in students:
                        progress = db.getStudentProgress(student[0], campaign[2], campaign[3])
                        progress = calculateProgress(progress, student[0], campaign[1])
                        campaign_progress[1].append(progress)
                    total_progress.append(campaign_progress)
        else:
            # student is viewing progress
            print('here')
            campaigns = list(db.studentGetCampaigns(username))
            print(campaigns)
            for campaign in campaigns:
                campaign_progress = [[campaign[0], campaign[1], str(campaign[2]), str(campaign[3])], []]
                progress = db.getStudentProgress(username, campaign[0][2], campaign[0][3])
                print("THIS SI THE PRORES")
                print(progress)
                print("PROGRESS END")
                progress = calculateProgress(progress, username, campaign[0][2])
                campaign_progress[1].append(progress)
                total_progress.append(campaign_progress)
                # print(total_progress)
        response["progress"] = total_progress
        response["code"] = 1
        return json.dumps(response)
    except Exception as e:
        print(e)
        response["code"] = 0
        return json.dumps(response)

'''
Helper function for /api/getProgress that calculates percentage of completion of a specific campaign
for a given student. Also handles that case where the student has not logged any work for the campaign.

Parameters:
    progress: result of getStudentProgress database query in the form (user, total_hours)
    username: username of student in case student is not found in query
    goal_hours: total hours of campaign

Returns:
    progress: complete progress report in the form (user, total_hours, percentage_complete)
'''
def calculateProgress(progress, username, goal_hours):
    if len(progress) > 0:
        user, total = progress[0]
        total = int(total)
        percentage = round(total / goal_hours * 100, 0)
        if percentage > 100:
            percentage = 100
    else:
        user = username
        total = 0
        percentage = 0
    progress = (user, int(total), percentage)
    return progress
'''
Gets total hours of logged work in specific class or for a specific student depending on role
Query has the option to be filtered by start date, end date, and teachers can request to see
a specific student's hours.

Input data format:
    "role": role of user, either "T" or "S"
    "username": username of user whose hours or class's hours we want
    "class": class name of class whose hours we want
    "start_date": optional filter, "" if not used
    "end_date": optional filter, "" if not used
    "student_filter": optional filter for teachers to see specific student's hours, "" if not used

Output data format:
    "code": 1 for success, 0 for failure
    "total_hours": total hours logged for student or class
'''
@app.route("/api/getTotalHours", methods=['GET'])
@cross_origin()
def getTotalHours():
    # data = request.get_json(force=True)
    start_date = request.args.get("start_date", default=None)
    end_date = request.args.get("end_date", default=None)
    role = request.args.get("role", default=None)
    student_filter = request.args.get("student_filter", default=None)
    username = request.args.get("username", default=None)
    current_class = request.args.get("current_class", default=None)
    response = {}
    try:
        total = 0
        try:
            if role == "T":
                if student_filter:
                    student_progress = db.getStudentProgress(student_filter, start_date, end_date)[0][1]
                    if student_progress:
                        total = int(student_progress)
                else:
                    class_hours = db.getClassTotalHours(username, current_class, start_date, end_date)[0][0]
                    if class_hours:
                        total = int(class_hours)
                response["total_hours"] = total
                response["code"] = 1
            else:
                student_progress = db.getStudentProgress(username, start_date, end_date)
                if len(student_progress) >= 1 and len(student_progress[0]) >= 2:
                    student_progress = student_progress[0][1]
                    total = int(student_progress)
                student_class_info = db.getStudentClass(username)[0]
                class_hours = db.getClassTotalHours(student_class_info[1], student_class_info[0], start_date, end_date)
                response["indiv_hours"] = total
                response["class_hours"] = class_hours
        except IndexError:
            pass
        
        return json.dumps(response, indent=4, sort_keys=True, default=str)
    except Exception as e:
        print(e)
        response["code"] = 0
        return json.dumps(response)

'''
Gets a list of recent work logged by students in a class or by a specific student. If this is
called from the dashboard to be displayed there, it will only retrieve work from the last 14 days.
Otherwise, if it is called from the view progress page, it will retrieve all past work.

input data format:
    "role": role of user retrieving progress
    "all_work": boolean flag to signal whether to retrieve all work or last 14 days of work
    "username": username of user retrieving progress
    "current_class": if role is "T", name of class who's progress we want

output data format:
    "code": 1 for success, 0 for failure
    "recent_work": list of recent work in the format [username, project, SDG, date, hours, description]
    "message": if no recent work, message telling user that no work has been logged in the time frame
'''
@app.route("/api/getRecentWork", methods=['GET'])
@cross_origin()
def getRecentWork():
    # data = request.get_json(force=True)
    role = request.args.get("role", default=None)
    all_work = request.args.get("all_work", default=None)
    username = request.args.get("username", default=None)
    current_class = request.args.get("current_class", default=None)
    response = {}
    start_date = str(date.today() - timedelta(14))
    end_date = str(date.today())
    try:
        if role == "T":
            if all_work:
                recent_work = db.teacherGetRecentWork(username, current_class)
                if len(recent_work) == 0:
                    response["message"] = "There has not been any work logged for this class."
                    response["code"] = 2
                else:
                    response["recent_work"] = recent_work
                    response["code"] = 1
            else:
                recent_work = db.teacherGetRecentWork(username, current_class, start_date, end_date)
                if len(recent_work) == 0:
                    response["message"] = "There has not been any work logged in the last 14 days for this class."
                    response["code"] = 2
                else:
                    response["recent_work"] = recent_work
                    response["code"] = 1
        else:
            if all_work:
                recent_work = db.studentGetRecentWork(username)
                if len(recent_work) == 0:
                    response["message"] = "You have not logged any work."
                    response["code"] = 2
                else:
                    response["recent_work"] = recent_work
                    response["code"] = 1
            else:
                recent_work = db.studentGetRecentWork(username, start_date, end_date)
                if len(recent_work) == 0:
                    response["message"] = "You have not logged any work in the last 14 days."
                    response["code"] = 2
                else:
                    response["recent_work"] = recent_work
                    response["code"] = 1
        return json.dumps(response, indent=4, sort_keys=True, default=str)
    except Exception as e:
        response["code"] = 0
        return json.dumps(response)

@app.route("/api/getGoalProgress", methods=['GET'])
@cross_origin()
def getGoalProgress():
    try:
        username = request.args.get("username", default=None)
        response = {}
        goal = db.getGoal(username)
        if len(goal) > 0:
            total_hours = goal[0]
            target_date = goal[1]
            progress = db.getStudentProgress(username, None, target_date)
            if len(progress) > 0:
                current_hours = int(progress[0][1])
            else:
                current_hours = 0
            response["total_hours"] = total_hours
            response["current_hours"] =  current_hours
        response["code"] = 1
        return json.dumps(response)
    except:
        response["code"] = 0
        return json.dumps(response)


@app.route("/api/deleteUserAccount", methods=['POST'])
@cross_origin()
def deleteUserAccount():
    try:
        data = request.get_json(force=True)
        username = data["currStudent"]
        response = {}
        print(username + "hello")
        db.deleteUser(username)
        response["code"] = 1
        return json.dumps(response)
    except:
        response["code"] = 0
        return json.dumps(response)