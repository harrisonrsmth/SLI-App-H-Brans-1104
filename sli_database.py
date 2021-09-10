import mysql.connector as mysql
from dotenv import load_dotenv

load_dotenv()
SQL_HOST = os.getenv("SQL_HOST")
SQL_USER = os.getenv('SQL_USER')
SQL_PASSWORD = os.getenv('SQL_PASSWORD')

class DB:

	def __init__(self):
		db_create = mysql.connect(
		host = SQL_HOST,
		user = SQL_USER,
		passwd = SQL_PASSWORD
		)

		cursor = db_create.cursor()
		cursor.execute("DROP DATABASE IF EXISTS sli_database")
		cursor.execute("CREATE DATABASE IF NOT EXISTS sli_database;")
		cursor.close()

		self.db = mysql.connect(
			host = SQL_HOST,
			user = SQL_USER,
			passwd = SQL_PASSWORD,
			database = "sli_database",
			autocommit = True
		)

		self.cursor = self.db.cursor()
		self.cursor.execute("DROP TABLE IF EXISTS student")
		self.cursor.execute("CREATE TABLE student ("
			+ "username VARCHAR(20) NOT NULL UNIQUE, "  # when creating account, supply first and last name, 
														# then auto generate username by doing 
														# fname[0] + lname + str(round(abs(hash(fname) / hash(lname)),4))[-4:]
			+ "password VARBINARY(100), "
			+ "fname VARCHAR(25), "
			+ "lname VARCHAR(25))")

		self.cursor.execute("DROP TABLE IF EXISTS teacher")
		self.cursor.execute("CREATE TABLE teacher ("
			+ "email VARCHAR(50) NOT NULL UNIQUE, "
			+ "password VARBINARY(100), "
			+ "fname VARCHAR(25), "
			+ "lname VARCHAR(25))")

		self.cursor.execute("DROP TABLE IF EXISTS class")
		self.cursor.execute("CREATE TABLE class ("
			+ "teacher_email VARCHAR(50) NOT NULL UNIQUE, "
			+ "name VARCHAR(100))")

	def getStudentLogin(self, username):
		self.cursor.execute("SELECT username, password FROM student WHERE username LIKE \"%" + str(username) + "\"")
		return self.cursor.fetchall()

	def getTeacherLogin(self, email):
		self.cursor.execute("SELECT email, password FROM teacher WHERE email LIKE \"%" + str(email) + "\"")

	def createNewClass(self, teacher_email, class_name):
	    self.cursor.execute("INSERT INTO class VALUES ( " + str(teacher_email) + ", " + str(class_name) + ")")