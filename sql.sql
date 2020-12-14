CREATE SCHEMA `Net` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE `Net`.`user` (
  `userEmail` VARCHAR(100) NOT NULL,
  `userName` VARCHAR(45) NULL,
  `password` VARCHAR(500) NULL,
  `register_data` DATETIME NULL DEFAULT now(),
  `nickname` VARCHAR(45) NULL,
  `address` VARCHAR(200) NULL,
  `phone` VARCHAR(50) NULL,
  `gender` VARCHAR(10) NULL,
  PRIMARY KEY (`userEmail`));

ALTER TABLE Net.user
ADD (email_auth boolean not null default 0);

CREATE TABLE `Net`.`community` (
  `commid` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(100) NULL,
  `title` VARCHAR(45) NULL,
  `content` VARCHAR(45) NULL,
  `comm_time` DATETIME NULL DEFAULT now(),
  `Img` VARCHAR(100) NULL,
  PRIMARY KEY (`commid`));

ALTER TABLE `Net`.`community` 
ADD INDEX `UserFK_idx` (`userEmail` ASC) VISIBLE;
;
ALTER TABLE `Net`.`community` 
ADD CONSTRAINT `UserFK`
  FOREIGN KEY (`userEmail`)
  REFERENCES `Net`.`user` (`userEmail`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

CREATE TABLE `Net`.`login_log` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(100) NULL,
  `login_date` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`idx`));


ALTER TABLE `Net`.`login_log` 
ADD INDEX `login_FK_idx` (`userEmail` ASC) VISIBLE;
;
ALTER TABLE `Net`.`login_log` 
ADD CONSTRAINT `login_FK`
  FOREIGN KEY (`userEmail`)
  REFERENCES `Net`.`user` (`userEmail`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

CREATE TABLE `Net`.`user_image` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(100) NULL,
  `image` VARCHAR(45) NULL,
  `image_time` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`idx`));

ALTER TABLE `Net`.`user_image` 
CHANGE COLUMN `image` `image` LONGTEXT NULL DEFAULT NULL ;


ALTER TABLE `Net`.`user_image` 
ADD INDEX `image_FK_idx` (`userEmail` ASC) VISIBLE;
;
ALTER TABLE `Net`.`user_image` 
ADD CONSTRAINT `image_FK`
  FOREIGN KEY (`userEmail`)
  REFERENCES `Net`.`user` (`userEmail`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

CREATE TABLE `Net`.`user_point` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(100) NULL,
  `point` INT NULL,
  `ponit_time` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`idx`));

ALTER TABLE `Net`.`user_point` 
ADD INDEX `point_FK_idx` (`userEmail` ASC) VISIBLE;
;
ALTER TABLE `Net`.`user_point` 
ADD CONSTRAINT `point_FK`
  FOREIGN KEY (`userEmail`)
  REFERENCES `Net`.`user` (`userEmail`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

CREATE TABLE `Net`.`lank` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `level` VARCHAR(45) NULL,
  `lankcol` VARCHAR(45) NULL,
  PRIMARY KEY (`idx`));

INSERT INTO `Net`.`lank` (`level`, `lankcol`) VALUES ('마스터', '4');
INSERT INTO `Net`.`lank` (`level`, `lankcol`) VALUES ('플레티넘', '4');
INSERT INTO `Net`.`lank` (`level`, `lankcol`) VALUES ('골드', '3');
INSERT INTO `Net`.`lank` (`level`, `lankcol`) VALUES ('실버', '2');
INSERT INTO `Net`.`lank` (`level`, `lankcol`) VALUES ('보론즈', '1');
INSERT INTO `Net`.`lank` (`level`, `lankcol`) VALUES ('아이언', '0');


INSERT INTO `Net`.`user_point` (`userEmail`, `point`) VALUES ('llmm030506@gmail.com', '1');
INSERT INTO `Net`.`user_point` (`userEmail`, `point`) VALUES ('llmm030506@gmail.com', '1');
