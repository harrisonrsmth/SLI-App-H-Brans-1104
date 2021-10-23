DROP DATABASE IF EXISTS sli_database;
CREATE DATABASE IF NOT EXISTS sli_database;
USE sli_database;

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
    username VARCHAR(40),
    password VARBINARY(100),
    role CHAR(1),
    fname VARCHAR(25),
    lname VARCHAR(25),
    PRIMARY KEY (username)
);

DROP TABLE IF EXISTS Class;
CREATE TABLE Class (
    teacher VARCHAR(40),
    name VARCHAR(100),
    PRIMARY KEY (teacher, name),
    FOREIGN KEY (teacher) REFERENCES `User`(username)
);

DROP TABLE IF EXISTS Token;
CREATE TABLE Token (
    `user` VARCHAR(40),
    token_val VARCHAR(50),
    PRIMARY KEY (`user`, token_val),
    FOREIGN KEY (`user`) REFERENCES `User`(username)
);

DROP TABLE IF EXISTS InClass;
CREATE TABLE InClass (
    teacher VARCHAR(40),
    class VARCHAR(100),
    student VARCHAR(40),
    PRIMARY KEY (teacher, class, student),
    FOREIGN KEY (teacher, class) REFERENCES Class(teacher, name),
    FOREIGN KEY (student) REFERENCES `User`(username)
);

DROP TABLE IF EXISTS `Work`;
CREATE TABLE `Work` (
    id INT AUTO_INCREMENT,
    `user` VARCHAR(40),
    project VARCHAR(50),
    SDG VARCHAR(50),
    `date` DATE,
    hours INT,
    `description` VARCHAR(200),
    PRIMARY KEY (id),
    FOREIGN KEY (`user`) REFERENCES `User`(username)
);

DROP TABLE IF EXISTS Campaign;
CREATE TABLE Campaign (
    teacher VARCHAR(40),
    class VARCHAR(100),
    name VARCHAR(50),
    total_hours INT,
    due_date DATE,
    PRIMARY KEY (teacher, class, name),
    FOREIGN KEY (teacher, class) REFERENCES Class(teacher, name)
);

DROP TABLE IF EXISTS Goal;
CREATE TABLE Goal (
    `user` VARCHAR(40),
    total_hours INT,
    target_date DATE,
    PRIMARY KEY (`user`),
    FOREIGN KEY (`user`) REFERENCES `User`(username)
);

DROP TABLE IF EXISTS ResetLink;
CREATE TABLE ResetLink (
    `user` VARCHAR(40),
    link VARBINARY(140),
    PRIMARY KEY (`user`, link),
    FOREIGN KEY (`user`) REFERENCES `User`(username)
);

/*INSERT INTO teacher (email, password, fname, lname) VALUES ("hey", "whatsup", "anh", "ho");
INSERT INTO class VALUES (1, "Mrs. Watson's 4th Grade Class");*/
