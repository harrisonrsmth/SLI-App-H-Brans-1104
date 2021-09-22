from cryptography.fernet import Fernet
from flask import Flask
import mysql.connector as mysql
import sli_database
from flask import request
import requests
from flask_cors import CORS, cross_origin
import random

app = Flask(__name__)
CORS(app)

key = b'mb_odrbq8UOpSh3Zd7mfsRTNLLIlnAuPJUB-FGZ_O7c='

db = sli_database.DB()

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
        db.createAccount(username, password, role, fname, lname)
        print("Account successfully created.")
    except Exception as Ex:
        print("Error creating account: %s"%(Ex))

#createUserTeacher(cursor, 0, "email_test", "pass_test", "f_test", "l_test")

@app.route("/api/authenticateLogin", methods=['POST'])
@cross_origin()
def login():
    data = request.get_json(force=True)
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
        print(password)
        print(str_pwd)
        if password == str_pwd and role == records[0][2]:
            token = generateToken(32)
            username = records[0][0]
            setUserToken(username, token)
            response["code"] = 1
            response["token"] = token
            response["username"] = username
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
    token = None
    if "token" in data:
        token = data["token"]
    else:
        return {"isLoggedIn": False}
    response = {}
    try:
        # get username by token
        results = None
        if token:
            results = db.getUserToken(token)
            if len(results) > 0:
                username = results[0][0]
                # get teacher information from ID
                if username:
                    get_user = db.getUserInfo(username)
                if len(get_user) > 0:
                    response["fname"] = get_user[0][0]
                else:
                    response["fname"] = "Anonymous"
                response["isLoggedIn"] = True
                response["username"] = username
        else:
            response["isLoggedIn"] = False
        return response
    except Exception as ex:
        print(ex)
        print("ERROR HAPPEN")
        return (ex)


@app.route("/api/createAccount", methods=['POST'])
def createAccount():
    data = request.get_json(force=True)
    print(data)
    if data["password"] == data["conf_password"] and len(data["password"]) >= 8:
        try:
            createUser(data["username"], data["password"], data["role"], data["fname"], data["lname"])
            return {"code": 1}
        except:
            return {"code": 2}
    else:
        return {"code": 0}

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
            print("success create class")
            response["code"] = 1
        return response

    except Exception as ex:
        return {"code": 0}



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
    except Exception as ex:
        return ex



'''
def main():
	logged_in = False
	teacher = False
	print(("Welcome to the S.L.I. App!"))
	while True:
		action = input("\nTo login, press 'l' then ENTER\n"
			+ "To create an account, press 'c' then ENTER\n"
			+ "\t- Must be logged in as a teacher to create student accounts\n"
			+ "To logout, press 'o' then ENTER\n"
			+ "To quit, press 'q' then ENTER\n")
		if action == 'l':
			print("\n### Login ###")
			if logged_in:
				print("You are already logged in. Please logout to login to a different account.")
			else:
				while True:
					role = input("Are you a teacher or a student? (t/s): ")
					if role == 't':
						l = login(0)
						if l == 0:
							logged_in = True
							teacher = True
						break
					elif role == 's':
						l = login(1)
						if l == 0:
							logged_in = False
						break
					else:
						print("Please enter either 't' or 's'")
		elif action == 'c':
			print("\n### Create Accounnt ###")
			#if logged_in:
				#print("You are already logged in. Please logout to create a new account.")
			#else:	
			while True:
				if teacher:
					role = input("Are you creating a teacher or student account? (t/s): ")
				else:
					role = 't'
				if role == 't':
					print("Creating teacher account")
					fname = input("First Name (type '/exit' to exit create account): ")
					if fname == "/exit":
						break
					lname = input("Last Name: ")
					email = input("Email: ")
					while True:
						password = input("Create Password: ")
						confirm_pass = input("Confirm Password: ")
						if confirm_pass != password:
							print("Password does not match. Please try again")
						else:
							break
					school_code = input("School Code: ")
					createUserTeacher(school_code, email, password, fname, lname)
					break
				elif role == 's':
					print("Creating student account")
					username = input("Username: ")
					while True:
						password = input("Create Password: ")
						confirm_pass = input("Confirm Password: ")
						if confirm_pass != password:
							print("Password does not match. Please try again")
						else:
							break
					createUserStudent(username, password)
					break
				else:
					print("Please enter either 't' or 's'")
		elif action == 'o':
			print("\n### Logout ###")
			if not logged_in:
				print("You are already logged out")
			else:
				print("You successfully logged out!")
				logged_in = False
				teacher = False
		elif action == 'q':
			print("\nGoodbye!")
			break
'''