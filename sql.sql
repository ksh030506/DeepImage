

CREATE SCHEMA `NetTest` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE `NetTest`.`user` (
  `userEmail` VARCHAR(100) NOT NULL,
  `userName` VARCHAR(45) NULL,
  `password` VARCHAR(500) NULL,
  `register_data` DATETIME NULL DEFAULT now(),
  `nickname` VARCHAR(45) NULL,
  `address` VARCHAR(200) NULL,
  `phone` VARCHAR(50) NULL,
  `gender` VARCHAR(10) NULL,
  PRIMARY KEY (`userEmail`));

ALTER TABLE NetTest.user
ADD (email_auth boolean not null default 0);

CREATE TABLE `NetTest`.`community` (
  `commid` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(100) NULL,
  `title` VARCHAR(45) NULL,
  `content` VARCHAR(45) NULL,
  `comm_time` DATETIME NULL DEFAULT now(),
  `Img` VARCHAR(100) NULL,
  PRIMARY KEY (`commid`));

ALTER TABLE `NetTest`.`community` 
ADD INDEX `UserFK_idx` (`userEmail` ASC) VISIBLE;
;
ALTER TABLE `NetTest`.`community` 
ADD CONSTRAINT `UserFK`
  FOREIGN KEY (`userEmail`)
  REFERENCES `NetTest`.`user` (`userEmail`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;

CREATE TABLE `NetTest`.`login_log` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(100) NULL,
  `login_date` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`idx`));


ALTER TABLE `NetTest`.`login_log` 
ADD INDEX `login_FK_idx` (`userEmail` ASC) VISIBLE;
;
ALTER TABLE `NetTest`.`login_log` 
ADD CONSTRAINT `login_FK`
  FOREIGN KEY (`userEmail`)
  REFERENCES `NetTest`.`user` (`userEmail`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `NetTest`.`user_image` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(100) NULL,
  `image` VARCHAR(45) NULL,
  `image_time` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`idx`));

ALTER TABLE `NetTest`.`user_image` 
ADD INDEX `image_FK_idx` (`userEmail` ASC) VISIBLE;
;
ALTER TABLE `NetTest`.`user_image` 
ADD CONSTRAINT `image_FK`
  FOREIGN KEY (`userEmail`)
  REFERENCES `NetTest`.`user` (`userEmail`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;

CREATE TABLE `NetTest`.`user_point` (
  `idx` INT NOT NULL AUTO_INCREMENT,
  `userEmail` VARCHAR(100) NULL,
  `point` INT NULL,
  `ponit_time` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`idx`));

ALTER TABLE `NetTest`.`user_point` 
ADD INDEX `point_FK_idx` (`userEmail` ASC) VISIBLE;
;
ALTER TABLE `NetTest`.`user_point` 
ADD CONSTRAINT `point_FK`
  FOREIGN KEY (`userEmail`)
  REFERENCES `NetTest`.`user` (`userEmail`)
  ON DELETE CASCADE
  ON UPDATE RESTRICT;

