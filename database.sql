
DROP TABLE IF EXISTS student;

CREATE TABLE student (
username VARCHAR(20) NOT NULL UNIQUE,
password VARBINARY(100),
fname VARCHAR(25),
lname VARCHAR(25));

DROP TABLE IF EXISTS teacher;
CREATE TABLE teacher (
email VARCHAR(50) NOT NULL UNIQUE,
password VARBINARY(100),
fname VARCHAR(25),
lname VARCHAR(25));

DROP TABLE IF EXISTS class;
CREATE TABLE class (
teacher_email VARCHAR(50) NOT NULL UNIQUE,
name VARCHAR(100));

INSERT INTO class VALUES ("hello", "hi");
INSERT INTO teacher VALUES ("hey", "whatsup", "anh", "ho");



