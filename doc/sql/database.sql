-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'places'
-- 
-- ---

DROP TABLE IF EXISTS `places`;
		
CREATE TABLE `places` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `id_zip_cities` INTEGER NULL DEFAULT NULL,
  `name` MEDIUMTEXT NULL DEFAULT NULL,
  `about` MEDIUMTEXT NULL DEFAULT NULL,
  `category` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'highways'
-- 
-- ---

DROP TABLE IF EXISTS `highways`;
		
CREATE TABLE `highways` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `name` MEDIUMTEXT NULL DEFAULT NULL,
  `about` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'routes'
-- 
-- ---

DROP TABLE IF EXISTS `routes`;
		
CREATE TABLE `routes` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `id_places` INTEGER NULL DEFAULT NULL,
  `id_highways` INTEGER NULL DEFAULT NULL,
  `exit` INTEGER NULL DEFAULT NULL,
  `miles` DECIMAL NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'cities'
-- 
-- ---

DROP TABLE IF EXISTS `cities`;
		
CREATE TABLE `cities` (
  `id_zip` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `name` MEDIUMTEXT NULL DEFAULT NULL,
  `about` MEDIUMTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id_zip`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `places` ADD FOREIGN KEY (id_zip_cities) REFERENCES `cities` (`id_zip`);
ALTER TABLE `routes` ADD FOREIGN KEY (id_places) REFERENCES `places` (`id`);
ALTER TABLE `routes` ADD FOREIGN KEY (id_highways) REFERENCES `highways` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `places` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `highways` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `routes` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `cities` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `places` (`id`,`id_zip_cities`,`name`,`about`,`category`) VALUES
-- ('','','','','');
-- INSERT INTO `highways` (`id`,`name`,`about`) VALUES
-- ('','','');
-- INSERT INTO `routes` (`id`,`id_places`,`id_highways`,`exit`,`miles`) VALUES
-- ('','','','','');
-- INSERT INTO `cities` (`id_zip`,`name`,`about`) VALUES
-- ('','','');
