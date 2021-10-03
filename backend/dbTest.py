import mysql.connector as mysql

db = mysql.connect(
    host = "localhost",
    user = "root",
    passwd = ""
)

print(db)

cursor = db.cursor()

cursor.execute("DROP DATABASE IF EXISTS test")

cursor.close()

cursor = db.cursor()

cursor.execute("CREATE DATABASE IF NOT EXISTS test;")