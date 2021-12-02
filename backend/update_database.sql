

USE sli_database;



ALTER TABLE Class DROP FOREIGN KEY class_ibfk_1;
ALTER TABLE Class
    ADD CONSTRAINT class_ibfk_1
    FOREIGN KEY (teacher) REFERENCES `User`(username) ON DELETE CASCADE;

ALTER TABLE Token DROP FOREIGN KEY token_ibfk_1;
ALTER TABLE Token
    ADD CONSTRAINT token_ibfk_1
    FOREIGN KEY (`user`) REFERENCES `User`(username) ON DELETE CASCADE;

ALTER TABLE InClass DROP FOREIGN KEY inclass_ibfk_1;
ALTER TABLE InClass DROP FOREIGN KEY inclass_ibfk_2;
ALTER TABLE InClass
    ADD CONSTRAINT inclass_ibfk_1
    FOREIGN KEY (teacher, class) REFERENCES Class(teacher, name) ON DELETE CASCADE;
ALTER TABLE InClass
    ADD CONSTRAINT inclass_ibfk_2
    FOREIGN KEY (student) REFERENCES `User`(username) ON DELETE CASCADE;

ALTER TABLE Work DROP FOREIGN KEY work_ibfk_1;
ALTER TABLE Work
    ADD CONSTRAINT work_ibfk_1
    FOREIGN KEY (User) REFERENCES User(username) ON DELETE CASCADE;


ALTER TABLE Campaign DROP FOREIGN KEY campaign_ibfk_1;
ALTER TABLE Campaign
    ADD CONSTRAINT campaign_ibfk_1
    FOREIGN KEY (teacher, class) REFERENCES Class(teacher, name) ON DELETE CASCADE;


ALTER TABLE Goal DROP FOREIGN KEY goal_ibfk_1;
ALTER TABLE Goal
    ADD CONSTRAINT goal_ibfk_1
    FOREIGN KEY (`user`) REFERENCES `User`(username) ON DELETE CASCADE;


ALTER TABLE ResetLink DROP FOREIGN KEY resetlink_ibfk_1;
ALTER TABLE ResetLink
    ADD CONSTRAINT resetlink_ibfk_1
    FOREIGN KEY (`user`) REFERENCES `User`(username) ON DELETE CASCADE;