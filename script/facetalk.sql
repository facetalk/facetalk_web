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
  `gender`             TINYINT(4) DEFAULT '1'
  COMMENT '性别 1男；0女；2其他',
  `sexual_orientation` TINYINT(4) DEFAULT '0'
  COMMENT '性取向：1男 0女 2其他',
  `introduction`       VARCHAR(255)
                       CHARACTER SET utf8 DEFAULT NULL
  COMMENT '自我介绍',

  `info_completeness`  TINYINT(4) DEFAULT '0'
  COMMENT '信息完成度，0 基本信息 1 完成头像',

  `price`              VARCHAR(100)
                       CHARACTER SET utf8 DEFAULT NULL
  COMMENT '价格',

  `creation_time`      TIMESTAMP          NOT NULL  DEFAULT 0
  COMMENT '创建时间',
  `modification_time`  TIMESTAMP          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '更新时间',
  PRIMARY KEY (`username`)
)

  ENGINE =InnoDB
  DEFAULT CHARSET =utf8
  COLLATE =utf8_bin;

ALTER TABLE fh_user ADD `ip` CHAR(15)
COMMENT '注册时ip';

ALTER TABLE fh_user MODIFY COLUMN ip VARCHAR(50);

DROP TABLE IF EXISTS `fh_groups`;
CREATE TABLE `fh_groups` (
  `group_name`  VARCHAR(255) NOT NULL
  COMMENT '兼容openfire',
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`group_name`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


DROP TABLE IF EXISTS `fh_groupusers`;
CREATE TABLE `fh_groupusers` (
  `group_name`    VARCHAR(50)  NOT NULL
  COMMENT '对应于groups表的groupName',
  `username`      VARCHAR(100) NOT NULL
  COMMENT '对应于user表的username',
  `administrator` TINYINT(4)   NOT NULL
  COMMENT '是否是管理员, 1是, 0否',
  PRIMARY KEY (`group_name`, `username`, `administrator`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


-- 修改openfire认证部分
DELETE FROM `openfire`.`ofProperty`
WHERE name =
      'jdbcprovider.driver'
      OR name =
         'jdbcprovider.connectionstring'
      OR name =
         'admin.authorizedjids'
      OR name =
         'jdbcauthprovider.passwordsql'
      OR name =
         'jdbcauthprovider.passwordtype'
      OR name =
         'jdbcuserprovider.alluserssql'
      OR name =
         'jdbcuserprovider.loadusersql'
      OR name =
         'jdbcuserprovider.usercountsql'
      OR name =
         'jdbcuserprovider.searchsql'
      OR name =
         'jdbcuserprovider.usernamefield'
      OR name =
         'jdbcuserprovider.namefield'
      OR name =
         'jdbcuserprovider.emailfield'
      OR name =
         'jdbcgroupprovider.allgroupssql'
      OR name =
         'jdbcgroupprovider.descriptionsql'
      OR name =
         'jdbcgroupprovider.groupcountsql'
      OR name =
         'jdbcgroupprovider.loadadminssql'
      OR name =
         'jdbcgroupprovider.loadmemberssql'
      OR name =
         'jdbcgroupprovider.usergroupssql'
      OR name = 'provider.auth.className'
      OR name = 'provider.group.className'
      OR name = 'provider.user.className';


INSERT INTO `openfire`.`ofProperty` VALUES
  ('provider.auth.className', 'org.jivesoftware.openfire.auth.JDBCAuthProvider'),
  ('provider.group.className', 'org.jivesoftware.openfire.group.JDBCGroupProvider'),
  ('provider.user.className', 'org.jivesoftware.openfire.user.JDBCUserProvider'),
  ('jdbcProvider.driver', 'com.mysql.jdbc.Driver'),
  ('jdbcProvider.connectionString', 'jdbc:mysql://localhost:3306/facehu?user=root&password=facehu'),
  ('admin.authorizedJIDs', 'admin@localhost,admin@192.168.0.46,admin@facetalk'),
  ('jdbcAuthProvider.passwordSQL', 'SELECT password FROM fh_user WHERE username=?'),
  ('jdbcAuthProvider.passwordType', 'plain'),
  ('jdbcUserProvider.allUsersSQL', 'SELECT username FROM fh_user'),
  ('jdbcUserProvider.loadUserSQL', 'SELECT name,email FROM fh_user WHERE username=?'),
  ('jdbcUserProvider.userCountSQL', 'SELECT COUNT(*) FROM fh_user'),
  ('jdbcUserProvider.searchSQL', 'SELECT username FROM fh_user WHERE'),
  ('jdbcUserProvider.usernameField', 'username'),
  ('jdbcUserProvider.nameField', 'name'),
  ('jdbcUserProvider.emailField', 'email'),
  ('jdbcGroupProvider.allGroupsSQL', 'select group_name from fh_groups'),
  ('jdbcGroupProvider.descriptionSQL', 'select description from fh_groups where group_name=?'),
  ('jdbcGroupProvider.groupCountSQL', 'select count(*) from fh_groups'),
  ('jdbcGroupProvider.loadAdminsSQL', 'select username from fh_groupusers where group_name=? and admin=1'),
  ('jdbcGroupProvider.loadMembersSQL', 'select username from fh_groupusers where group_name=? and admin=0'),
  ('jdbcGroupProvider.userGroupsSQL', 'select group_name from fh_groupusers where username=?');


-- 产品表

DROP TABLE IF EXISTS `fh_product`;
CREATE TABLE `fh_product` (
  `name`          VARCHAR(20)  NOT NULL
  COMMENT '产品名称 ',
  `price`         INT(11) DEFAULT '0'
  COMMENT '产品价格，单位是分',
  `status`        INT(11) DEFAULT '1'
  COMMENT '产品状态：0 失效，1 有效',
  `desc`          VARCHAR(255) NULL
  COMMENT '产品说明',
  `creation_time` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
  COMMENT '创建日期',
  PRIMARY KEY (`name`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


-- 订单生成
DROP TABLE IF EXISTS `fh_order`;
CREATE TABLE `fh_order` (
  `id`                VARCHAR(64)  NOT NULL
  COMMENT ' id ',
  `username`          VARCHAR(255) NOT NULL
  COMMENT '用户',
  `product_name`      VARCHAR(20)  NOT NULL
  COMMENT '产品id',
  `product_desc`      VARCHAR(20)  NOT NULL
  COMMENT '产品名称 ',
  `product_amount`    INT(11)      NOT NULL
  COMMENT '产品数量',
  `total_cost`        INT(11) DEFAULT '0'
  COMMENT '总花费单位是分',
  `pay_status`        INT(11) DEFAULT '0'
  COMMENT '支付状态：0 未确认，1 已提交支付 2 支付完成 3 支付失败',
  `bank`              VARCHAR(50) DEFAULT NULL
  COMMENT '支付的银行代码',
  `pay_way`           INT(11) DEFAULT '0'
  COMMENT '支付方式,目前只有alipay',
  `order_desc`        VARCHAR(255) NOT NULL
  COMMENT '支付说明',
  `creation_time`     TIMESTAMP    NOT NULL DEFAULT 0
  COMMENT '创建时间',
  `modification_time` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '更新时间',
  PRIMARY KEY (`id`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


DROP TABLE IF EXISTS `fh_bill`;
CREATE TABLE `fh_bill` (
  `id`                BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `username`          VARCHAR(255) NOT NULL
  COMMENT '用户',
  `product_name`      VARCHAR(20)  NOT NULL
  COMMENT '产品id',
  `product_amount`    INT(11) DEFAULT '0'
  COMMENT '产品数量，负值为扣减，正值为增加',
  `type`              INT(11) DEFAULT '2'
  COMMENT '1 增加 2 消费 ',
  `gain_way`          INT(11) DEFAULT '0'
  COMMENT '获得方式 1 购买 2 赠予 3 正常消费 4 系统扣除 ',
  `correlation_id`    VARCHAR(100) DEFAULT NULL
  COMMENT '关联id，获得为订单号，扣减为聊天记录id',
  `bill_desc`         VARCHAR(255) DEFAULT NULL,
  `flag`              INT(11) DEFAULT '0'
  COMMENT '0 正常 ,1 消费冻结 ,2 消费冻结取消（等于这条记录不存在） ',
  `creation_time`     TIMESTAMP    NOT NULL DEFAULT 0
  COMMENT '创建时间',
  `modification_time` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_bill` (`username`, `correlation_id`) USING BTREE
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


DROP TABLE IF EXISTS `fh_balance`;
CREATE TABLE `fh_balance` (
  `id`                BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `username`          VARCHAR(255) NOT NULL
  COMMENT '用户',
  `product_name`      VARCHAR(20)  NOT NULL
  COMMENT '产品名称',
  `current_amount`    INT(11)      NOT NULL
  COMMENT '产品数量，负值为扣减，正值为增加',
  `version`           INT(11) DEFAULT '0'
  COMMENT '乐观锁',
  `creation_time`     TIMESTAMP    NOT NULL DEFAULT 0
  COMMENT '创建时间',
  `modification_time` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_balance` (`username`, `product_name`) USING BTREE
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


--  订单支付结果 @todo 后续补全
DROP TABLE IF EXISTS `fh_order_pay_res`;
CREATE TABLE `fh_order_pay_res` (
  `id`                BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `order_id`          VARCHAR(64) DEFAULT NULL
  COMMENT '订单id fh_order表id ',
  `username`          VARCHAR(255) NOT NULL
  COMMENT '操作用户',
  `product_name`      VARCHAR(20)  NOT NULL
  COMMENT '产品名称 ',
  `trade_no`          VARCHAR(64) DEFAULT NULL
  COMMENT '交易编号 ',
  `trade_status`      VARCHAR(32) DEFAULT NULL
  COMMENT '交易状态 ',
  `total_cost`        INT(11) DEFAULT '0'
  COMMENT '总花费单位是分',
  `notify_time`       DATETIME DEFAULT NULL,
  `notify_type`       VARCHAR(200) DEFAULT NULL,
  `notify_id`         VARCHAR(200) DEFAULT NULL,
  `sign`              VARCHAR(100) DEFAULT NULL,
  `exterface`         VARCHAR(100) DEFAULT NULL,
  `buyer_email`       VARCHAR(200) DEFAULT NULL,
  `buyer_id`          VARCHAR(30) DEFAULT NULL,
  `extra_param`       VARCHAR(100) DEFAULT NULL,
  `agent_user_id`     VARCHAR(100) DEFAULT NULL,
  `creation_time`     TIMESTAMP    NOT NULL DEFAULT 0
  COMMENT '创建时间',
  `modification_time` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '更新时间',
  `message`           TEXT         NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_o_u` (`order_id`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;


--  聊天记录
DROP TABLE IF EXISTS `fh_chat_record`;
CREATE TABLE `fh_chat_record` (
  `id`                  BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `calling_username`    VARCHAR(255) NOT NULL
  COMMENT '主叫用户',
  `called_username`     VARCHAR(255) NOT NULL
  COMMENT '被叫用户',
  `spend_productname`   VARCHAR(20)
  COMMENT '花费的产品名称 ',
  `spend_productamount` INT(11) DEFAULT '0'
  COMMENT '花费的产品数量',
  `begin_time`          DATETIME     NOT NULL DEFAULT 0
  COMMENT '创建时间',
  `finish_time`         DATETIME
  COMMENT '更新时间',
  `is_calling_del`      INT(11) DEFAULT '0'
  COMMENT '主叫方是否已经删除 0 未删除 1已删除',
  `is_called_del`       INT(11) DEFAULT '0'
  COMMENT '被叫方是否已经删除 0 未删除 1已删除',
  PRIMARY KEY (`id`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;

--  用户登陆
DROP TABLE IF EXISTS `fh_user_login_log`;
CREATE TABLE `fh_user_login_log` (
  `id`                BIGINT(11)  NOT NULL AUTO_INCREMENT,
  `username`          VARCHAR(50) NOT NULL DEFAULT ''
  COMMENT '用户名',
  `name`              VARCHAR(100)
                      CHARACTER SET utf8 DEFAULT NULL
  COMMENT '用户昵称',

  `info_completeness` TINYINT(4) DEFAULT '0'
  COMMENT '信息完成度，0 基本信息 1 完成头像',

  `ip`                CHAR(15)    NOT NULL
  COMMENT '登陆ip',
  `login_time`        TIMESTAMP   NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP COMMENT '登陆时间',
  PRIMARY KEY (`id`),
  KEY `login_time` (`login_time`),
  KEY `username` (`username`)
)
  ENGINE =MyISAM
  DEFAULT CHARSET =utf8;






