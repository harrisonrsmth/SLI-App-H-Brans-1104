import mysql.connector as mysql

db = mysql.connect(
    host = "localhost",
    user = "root",
    passwd = ""
)

print(db)

cursor = db.cursor()

cursor.execute("DROP DATABASE IF EXISTS sli_database")

cursor.execute("CREATE DATABASE IF NOT EXISTS sli_database;")

cursor.close()

db1 = mysql.connect(
    host = "localhost",
    user = "root",
    passwd = "",
    database = "sli_database"
)

cursor = db1.cursor()

cursor.execute("DROP TABLE IF EXISTS student")

cursor.execute("CREATE TABLE student (username VARCHAR(20) NOT NULL UNIQUE, password VARCHAR(20))")


cursor.execute("DROP TABLE IF EXISTS teacher")

cursor.execute("CREATE TABLE teacher (school_code int, email VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(20), fname VARCHAR(25), lname VARCHAR(25))")


cursor.execute("INSERT INTO student VALUES (\"student\", \"student\")")
cursor.execute("INSERT INTO teacher VALUES (1, \"teacher\", \"teacher\", \"ABC\", \"DEF\")")

role = input("Are you a teacher(0) or a student(1)?: ")
def createUserStudent(cursor, username, password,
               querynum=0, 
               updatenum=0, 
               connection_num=0):
    try:
        cursor.execute("INSERT INTO student VALUES (\"%s\", \"%s\")"%(username, password))
        print("Student account successfully created.")
    except Exception as Ex:
        print("Error creating Student account: %s"%(Ex))

createUserStudent(cursor, "user_test", "pass_test")

def createUserTeacher(cursor, school_code, email, password, fname, lname,
               querynum=0, 
               updatenum=0, 
               connection_num=0):
    try:
        cursor.execute("INSERT INTO teacher VALUES (\"%s\", \"%s\", \"%s\", \"%s\", \"%s\")"%(school_code, email, password, fname, lname))
        print("Teacher account successfully created.")
    except Exception as Ex:
        print("Error creating Teacher account: %s"%(Ex))

createUserTeacher(cursor, 0, "email_test", "pass_test", "f_test", "l_test")

def login(role: int):
	if role == '1':
		while True:
			username = input("Username: ")
			password = input("Password: ")

			cursor = db1.cursor()
			cursor.execute("SELECT password FROM student WHERE username LIKE \"%" + str(username) + "\"")

			records = cursor.fetchall()
			if records and password in records[0]:
				print("You are successfully logged in!")
				break
			else:
				print("Your username or password is incorrect. Please try again!")

	elif role == '0':
		while True:
			email = input("Email: ")
			password = input("Password: ")

			cursor = db1.cursor()
			cursor.execute("SELECT email, password FROM teacher WHERE email LIKE \"%" + str(email) + "\"")

			records = cursor.fetchall()
			if records and password in records[0]:
				print("You are successfully logged in!")
				break
			else:
				print("Your email or password is incorrect. Please try again!")

login(role)

cursor.close()
