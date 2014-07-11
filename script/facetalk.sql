
'建表相关语句'
SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `fh_user`
-- ----------------------------
DROP TABLE IF EXISTS `fh_user`;
CREATE TABLE `fh_user` (
  `username` varchar(255) CHARACTER SET latin1 NOT NULL COMMENT '用户名，将用户的注册邮箱@替换成_形成',
  `password` varchar(255) CHARACTER SET latin1 NOT NULL COMMENT 'MD5加密密码',
  `name` varchar(100) CHARACTER SET latin1 DEFAULT NULL COMMENT '用户昵称',
  `email` varchar(100) CHARACTER SET latin1 DEFAULT NULL COMMENT '邮箱地址',
  `gender` tinyint(4) DEFAULT NULL COMMENT '性别 1男；0女；2其他',
  `sexual_orientation` tinyint(4) DEFAULT NULL COMMENT '性取向：1男 0女 2其他',
  `introduction` varchar(255) CHARACTER SET latin1 DEFAULT NULL COMMENT '自我介绍',
  `creation_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `modification_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新时间',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

