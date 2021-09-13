
DROP TABLE IF EXISTS student;

CREATE TABLE student (
username VARCHAR(20) NOT NULL UNIQUE,
password VARBINARY(100),
fname VARCHAR(25),
lname VARCHAR(25));

DROP TABLE IF EXISTS class;
DROP TABLE IF EXISTS teacher;


CREATE TABLE teacher (
id INT NOT NULL AUTO_INCREMENT,
email VARCHAR(50) NOT NULL UNIQUE,
password VARBINARY(100),
fname VARCHAR(25),
lname VARCHAR(25),
PRIMARY KEY (id)
);
ALTER TABLE teacher AUTO_INCREMENT=1;

CREATE TABLE class (
id INT NOT NULL ,
name VARCHAR(100),
PRIMARY KEY (name),
FOREIGN KEY (id) REFERENCES teacher(id)
);

DROP TABLE IF EXISTS token;
CREATE TABLE token (
id INT NOT NULL,
token VARCHAR(50)
);

INSERT INTO teacher (email, password, fname, lname) VALUES ("hey", "whatsup", "anh", "ho");
INSERT INTO class VALUES (1, "Mrs. Watson's 4th Grade Class");


