from cryptography.fernet import Fernet
from flask import Flask
import mysql.connector as mysql
import sli_database
from flask import request
import requests

app = Flask(__name__)

key = b'mb_odrbq8UOpSh3Zd7mfsRTNLLIlnAuPJUB-FGZ_O7c='

db = sli_database.DB()

def createUserStudent(username, password,
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
		print("Error creating Student account: %s"%(Ex))

#createUserStudent(cursor, "user_test", "pass_test")

def createUserTeacher(school_code, email, password, fname, lname,
               querynum=0, 
               updatenum=0, 
               connection_num=0):	
	cipher_suite = Fernet(key)
	password = str.encode(password)
	ciphered_password = cipher_suite.encrypt(password)
	ciphered_password = bytes(ciphered_password).decode("utf-8")

	cursor = db.cursor()
	try:
		cursor.execute("INSERT INTO teacher VALUES (\"%s\", \"%s\", \"%s\", \"%s\", \"%s\")"%(school_code, email, ciphered_password, fname, lname))
		print("Teacher account successfully created.")
	except Exception as Ex:
		print("Error creating Teacher account: %s"%(Ex))

#createUserTeacher(cursor, 0, "email_test", "pass_test", "f_test", "l_test")

@app.route("/authenticateLogin")
def login(role, username, password):
	if role == 1: # student
		records = db.getStudentLogin(username)
		if len(records) > 0:
			cipher_suite = Fernet(key)
			encrypted_pwd = str.encode(records[0][1])
			unciphered_text = cipher_suite.decrypt(encrypted_pwd)
			fetched = bytes(unciphered_text).decode("utf-8")
			if password == fetched:
				return {"code": 1} # success
			else:
				return {"code": 0} # failure- password incorrect
		else:
			return {"code": 0} # failure- username doesn't exist
	else: #teacher
			records = db.getTeacherLogin(username)
			if len(records) > 0:
				cipher_suite = Fernet(key)
				encrypted_pwd = str.encode(records[0][1])
				unciphered_text = cipher_suite.decrypt(encrypted_pwd)
				fetched = bytes(unciphered_text).decode("utf-8")
				if password == fetched:
					return {"code": 1} # success
				else:
					return {"code": 0} # failure- password incorrect
			else:
				return {"code": 0} # failure- email doesn't exist

@app.route("/createClass")
def createClass(role, email, class_name):
    if role != 1:
        return "Only teacher can create an account"
    else:
        if email and class_name:
            records = db.createNewClass(email, class_name)



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