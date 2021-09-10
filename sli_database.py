import mysql.connector as mysql

class DB:

	def __init__(self):


		self.db = mysql.connect(
			host = "localhost",
			user = "root",
			passwd = "hoanhtuan2204",
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