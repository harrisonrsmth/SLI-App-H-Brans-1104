import mysql.connector as mysql
from cryptography.fernet import Fernet

key = b'mb_odrbq8UOpSh3Zd7mfsRTNLLIlnAuPJUB-FGZ_O7c='

db = mysql.connect(
	host = "localhost",
	user = "root",
	passwd = ""
)

#print(db)

cursor = db.cursor()

cursor.execute("DROP DATABASE IF EXISTS sli_database")

cursor.execute("CREATE DATABASE IF NOT EXISTS sli_database;")

cursor.close()

db1 = mysql.connect(
	host = "localhost",
	user = "root",
	passwd = "",
	database = "sli_database",
	autocommit = True
)

cursor = db1.cursor()

cursor.execute("DROP TABLE IF EXISTS student")

cursor.execute("CREATE TABLE student (username VARCHAR(20) NOT NULL UNIQUE, password VARBINARY(100))")


cursor.execute("DROP TABLE IF EXISTS teacher")

cursor.execute("CREATE TABLE teacher (school_code int, email VARCHAR(50) NOT NULL UNIQUE, password VARBINARY(100), fname VARCHAR(25), lname VARCHAR(25))")


#cursor.execute("INSERT INTO student VALUES (\"student\", \"student\")")
#cursor.execute("INSERT INTO teacher VALUES (1, \"teacher\", \"teacher\", \"ABC\", \"DEF\")")

def createUserStudent(username, password,
               querynum=0, 
               updatenum=0, 
               connection_num=0):
	cipher_suite = Fernet(key)
	password = str.encode(password)
	ciphered_password = cipher_suite.encrypt(password)
	ciphered_password = bytes(ciphered_password).decode("utf-8")

	cursor = db1.cursor()
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

	cursor = db1.cursor()
	try:
		cursor.execute("INSERT INTO teacher VALUES (\"%s\", \"%s\", \"%s\", \"%s\", \"%s\")"%(school_code, email, ciphered_password, fname, lname))
		print("Teacher account successfully created.")
	except Exception as Ex:
		print("Error creating Teacher account: %s"%(Ex))

#createUserTeacher(cursor, 0, "email_test", "pass_test", "f_test", "l_test")

def login(role: int):
	if role == 1:
		while True:
			username = input("Username (type '/exit' to exit login): ")
			if username == "/exit":
				return -1
			password = input("Password: ")

			cursor = db1.cursor()
			cursor.execute("SELECT username, password FROM student WHERE username LIKE \"%" + str(username) + "\"")

			records = cursor.fetchall()
			if len(records) > 0:
				cipher_suite = Fernet(key)
				encrypted_pwd = str.encode(records[0][1])
				unciphered_text = cipher_suite.decrypt(encrypted_pwd)
				fetched = bytes(unciphered_text).decode("utf-8")
				if password == fetched:
					print("You are successfully logged in!")
					return 0
				else:
					print("Your password is incorrect. Please try again!")
			else:
				print("There is no account associated with that username. Please try again!")

	elif role == 0:
		while True:
			email = input("Email (type '/exit' to exit login): ")
			if email == "/exit":
				return -1
			password = input("Password: ")

			cursor = db1.cursor()
			cursor.execute("SELECT email, password FROM teacher WHERE email LIKE \"%" + str(email) + "\"")

			records = cursor.fetchall()
			if len(records) > 0:
				cipher_suite = Fernet(key)
				encrypted_pwd = str.encode(records[0][1])
				unciphered_text = cipher_suite.decrypt(encrypted_pwd)
				fetched = bytes(unciphered_text).decode("utf-8")
				if password == fetched:
					print("You are successfully logged in!")
					return 0
				else:
					print("Your password is incorrect. Please try again!")
			else:
				print("There is no account associated with that email. Please try again!")
#login(role)


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

if __name__ == "__main__":
	main()