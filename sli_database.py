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

cursor.execute("CREATE TABLE student (username VARCHAR(20), password VARCHAR(20))")


cursor.execute("DROP TABLE IF EXISTS teacher")

cursor.execute("CREATE TABLE teacher (school_code int, email VARCHAR(50), password VARCHAR(20), fname VARCHAR(25), lname VARCHAR(25))")


cursor.close()