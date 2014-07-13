-- 建表相关语句
SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;


-- 用户
DROP TABLE IF EXISTS `fh_user`;
CREATE TABLE `fh_user` (
  `username`           VARCHAR(255)
                       CHARACTER SET utf8 NOT NULL
  COMMENT '用户名，将用户的注册邮箱@替换成_形成',
  `password`           VARCHAR(255)
                       CHARACTER SET utf8 NOT NULL
  COMMENT 'MD5加密密码',
  `name`               VARCHAR(100)
                       CHARACTER SET utf8 DEFAULT NULL
  COMMENT '用户昵称',
  `email`              VARCHAR(100)
                       CHARACTER SET utf8 DEFAULT NULL
  COMMENT '邮箱地址',
  `gender`             TINYINT(4) DEFAULT NULL
  COMMENT '性别 1男；0女；2其他',
  `sexual_orientation` TINYINT(4) DEFAULT NULL
  COMMENT '性取向：1男 0女 2其他',
  `introduction`       VARCHAR(255)
                       CHARACTER SET utf8 DEFAULT NULL
  COMMENT '自我介绍',
  `creation_time`      TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `modification_time`  TIMESTAMP          NOT NULL DEFAULT '0000-00-00 00:00:00'
  COMMENT '更新时间',
  PRIMARY KEY (`username`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8
  COLLATE =utf8_bin;

-- 产品表

DROP TABLE IF EXISTS `fh_product`;
CREATE TABLE `fh_product` (
  `id`             BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `product_name`   VARCHAR(20)  NOT NULL
  COMMENT '产品名称 ',
  `product_price`  INT(11) DEFAULT '0'
  COMMENT '产品价格，单位是分',
  `product_status` INT(11) DEFAULT '1'
  COMMENT '产品状态：0 失效，1 有效',
  `product_desc`   VARCHAR(255) NULL
  COMMENT '产品说明',
  `create_date`    TIMESTAMP
  COMMENT '创建日期',
  PRIMARY KEY (`id`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


-- 订单生成
DROP TABLE IF EXISTS `fh_order`;
CREATE TABLE `fh_order` (
  `id`            VARCHAR(64)  NOT NULL
  COMMENT ' id ',
  `username`      VARCHAR(255) NOT NULL
  COMMENT '操作用户',
  `product_id`    INT(11)      NOT NULL
  COMMENT '产品id',
  `product_name`  VARCHAR(20)  NOT NULL
  COMMENT '产品名称 ',
  `product_count` INT(11)      NOT NULL
  COMMENT '产品数量',
  `total_cost`    INT(11) DEFAULT '0'
  COMMENT '总花费单位是分',
  `pay_status`    INT(11) DEFAULT '0'
  COMMENT '支付状态：0 待支付，1 已提交支付 2 支付完成',
  `bank`          VARCHAR(50) DEFAULT NULL
  COMMENT '支付的银行代码',
  `pay_way`       INT(11) DEFAULT '0'
  COMMENT '支付方式,目前只有alipay',
  `order_desc`    VARCHAR(255) NOT NULL
  COMMENT '支付说明',
  `create_date`   DATETIME
  COMMENT '创建日期',
  `updae_date`    DATETIME
  COMMENT '更新日期',
  PRIMARY KEY (`id`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


--  订单支付结果 @todo 后续补全
DROP TABLE IF EXISTS `fh_order_pay_res`;
CREATE TABLE `fh_order_pay_res` (
  `id`            BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `order_id`      VARCHAR(64) DEFAULT NULL
  COMMENT '订单id fh_order表id ',
  `username`      VARCHAR(255) NOT NULL
  COMMENT '操作用户',
  `product_name`  VARCHAR(20)  NOT NULL
  COMMENT '产品名称 ',
  `trade_no`      VARCHAR(64) DEFAULT NULL
  COMMENT '交易编号 ',
  `trade_status`  VARCHAR(32) DEFAULT NULL
  COMMENT '交易状态 ',
  `total_cost`    INT(11) DEFAULT '0'
  COMMENT '总花费单位是分',
  `notify_time`   DATETIME DEFAULT NULL,
  `notify_type`   VARCHAR(200) DEFAULT NULL,
  `notify_id`     VARCHAR(200) DEFAULT NULL,
  `sign`          VARCHAR(100) DEFAULT NULL,
  `exterface`     VARCHAR(100) DEFAULT NULL,
  `buyer_email`   VARCHAR(200) DEFAULT NULL,
  `buyer_id`      VARCHAR(30) DEFAULT NULL,
  `extra_param`   VARCHAR(100) DEFAULT NULL,
  `agent_user_id` VARCHAR(100) DEFAULT NULL,
  `create_date`   DATETIME DEFAULT NULL,
  `message`       TEXT         NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_o_u` (`order_id`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;

