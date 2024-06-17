/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80300 (8.3.0)
 Source Host           : localhost:3306
 Source Schema         : goggles-dev

 Target Server Type    : MySQL
 Target Server Version : 80300 (8.3.0)
 File Encoding         : 65001

 Date: 18/06/2024 00:39:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `status` enum('2','1','0') NOT NULL DEFAULT '1' COMMENT '状态',
  `delete_date` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `path` varchar(255) NOT NULL COMMENT '路由',
  `level` int NOT NULL DEFAULT '1' COMMENT '层级',
  `description` varchar(255) DEFAULT NULL COMMENT '描述',
  `sort` int DEFAULT NULL COMMENT '排序',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `parent_id` int DEFAULT NULL COMMENT '父级菜单id',
  PRIMARY KEY (`id`),
  KEY `FK_e5e28130fd17f88ab5ee5d3aa4c` (`parent_id`),
  CONSTRAINT `FK_e5e28130fd17f88ab5ee5d3aa4c` FOREIGN KEY (`parent_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1021 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of menu
-- ----------------------------
BEGIN;
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1003, '2024-05-30 11:58:51', '2024-06-17 16:28:32', '1', NULL, '主页', '/main', 1, '', 7, 'rainbow', NULL);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1004, '2024-05-30 12:02:08', '2024-06-17 16:28:31', '1', NULL, '应用图标', '/main/app-icon', 2, '', 6, 'rainbow', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1005, '2024-05-30 12:03:19', '2024-06-17 16:28:31', '1', NULL, '应用图标(分片渲染版)', '/main/app-icon(requestAnimationFrame)', 2, '', 5, 'book-open', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1006, '2024-05-30 12:03:58', '2024-06-17 16:28:31', '1', NULL, '思维导图', '/main/mind', 2, '', 4, 'beauty-makeup\n', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1011, '2024-05-31 11:40:21', '2024-06-17 16:28:31', '1', NULL, '系统角色', '/main/roles', 2, '', 2, 'rose1', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1012, '2024-06-03 23:00:25', '2024-06-17 16:28:31', '1', NULL, '系统用户', '/main/user', 2, NULL, 3, 'fingerprint', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1013, '2024-06-04 00:15:34', '2024-06-17 16:28:31', '1', NULL, '首页中心', '/main/omni', 2, NULL, 1, 'shujutongji', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1014, '2024-06-15 19:58:55', '2024-06-17 16:28:31', '1', NULL, '系统菜单', '/main/menu', 2, NULL, 8, 'fingerprint', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1016, '2024-06-17 16:20:48', '2024-06-17 16:28:31', '1', NULL, '123', '123', 2, '12312', 12, '123', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1017, '2024-06-17 16:25:57', '2024-06-17 16:28:31', '1', NULL, '123', '123', 3, '123', 123, '12', 1003);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1018, '2024-06-17 16:27:37', '2024-06-17 16:28:37', '1', NULL, '123', '123', 2, '123', 123, '123', 1014);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1019, '2024-06-17 16:29:15', '2024-06-18 00:29:16', '1', NULL, '12311', '1231111', 2, NULL, 111, '123', NULL);
INSERT INTO `menu` (`id`, `create_time`, `update_time`, `status`, `delete_date`, `name`, `path`, `level`, `description`, `sort`, `icon`, `parent_id`) VALUES (1020, '2024-06-17 16:30:51', '2024-06-18 00:30:51', '1', NULL, '123123123123', '123123123', 3, '123', 123123, '123123', 1014);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
