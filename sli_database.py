import mysql.connector as mysql
from dotenv import load_dotenv
import os

load_dotenv()
SQL_HOST = os.getenv("SQL_HOST")
SQL_USER = os.getenv('SQL_USER')
SQL_PASSWORD = os.getenv('SQL_PASSWORD')

class DB:

	def __init__(self):

		self.db = mysql.connect(

			host = SQL_HOST,
			user = SQL_USER,
			passwd = SQL_PASSWORD,
			database = "sli_database",
			autocommit = True
		)

		self.cursor = self.db.cursor()

	def getStudentLogin(self, username):
		self.cursor.execute("SELECT username, password FROM student WHERE username LIKE \"%" + str(username) + "\"")
		return self.cursor.fetchall()

	def getTeacherLogin(self, email):
		self.cursor.execute("SELECT email, password FROM teacher WHERE email LIKE \"%" + str(email) + "\"")

	def createNewClass(self, teacher_email, class_name):

	    self.cursor.execute("INSERT INTO class VALUES (teacher_email='" + str(teacher_email) + "', name='" + str(class_name) + "')")