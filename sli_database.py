import mysql.connector as mysql

db = mysql.connect(
    host = "localhost",
    user = "root",
    passwd = "hoanhtuan2204"
)

print(db)

cursor = db.cursor()

cursor.execute("DROP DATABASE IF EXISTS sli_database")

cursor.execute("CREATE DATABASE IF NOT EXISTS sli_database;")

cursor.close()

db1 = mysql.connect(
    host = "localhost",
    user = "root",
    passwd = "hoanhtuan2204",
    database = "sli_database"
)

cursor = db1.cursor()

cursor.execute("DROP TABLE IF EXISTS student")

cursor.execute("CREATE TABLE student (username VARCHAR(20) NOT NULL UNIQUE, password VARCHAR(20))")


cursor.execute("DROP TABLE IF EXISTS teacher")

cursor.execute("CREATE TABLE teacher (school_code int, email VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(20), fname VARCHAR(25), lname VARCHAR(25))")


cursor.execute("INSERT INTO student VALUES (\"student\", \"student\")")
cursor.execute("INSERT INTO teacher VALUES (1, \"teacher\", \"teacher\", \"ABC\", \"DEF\")")

cursor.close()

role = input("Are you teacher(0) or student(1) ?: ")

def login(role: int):
	if role == '1':
		while True:
			username = input("Username: ")
			password = input("Password: ")

			cursor = db1.cursor()
			cursor.execute("SELECT password FROM student WHERE username LIKE \"%" + str(username) + "\"")

			records = cursor.fetchall()
			if records and password in records[0]:
				print("You are successfully login !")
				break
			else:
				print("Your username or password is incorrect. Please try again !")

	elif role == '0':
		while True:
			email = input("Email: ")
			password = input("Password: ")

			cursor = db1.cursor()
			cursor.execute("SELECT email, password FROM teacher WHERE email LIKE \"%" + str(email) + "\"")

			records = cursor.fetchall()
			if records and password in records[0]:
				print("You are successfully login !")
				break
			else:
				print("Your email or password is incorrect. Please try again !")

login(role)


