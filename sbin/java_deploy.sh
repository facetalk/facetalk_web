#!/bin/sh

# 用source 执行，或者 . ./java_deploy.sh

git pull

# 拷贝nginx配置
yes | cp -R /opt/src/facetalk_web/ningx_lua/nginx.conf /usr/local/openresty/nginx/conf/

# 拷贝lua脚本
yes | cp -R /opt/src/facetalk_web/ningx_lua/*.lua /usr/local/openresty/nginx/lua_script/

# 编译代码
cd /opt/src/facetalk_web/springMVC
mvn clean package

# 停止tomcat
sh /opt/server/tomcat/bin/shutdown.sh

# 删除ROOT文件

rm -rf /opt/facehu-web/ROOT

# 拷贝war文件
yes | cp /opt/src/facetalk_web/springMVC/target/facetalk_web.war /opt/facehu-web/java_production/

# 启动tomcat
sh /opt/server/tomcat/bin/startup.sh

# 重启 nginx
/usr/local/openresty/nginx/sbin/nginx -s reload
