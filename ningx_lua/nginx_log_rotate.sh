#!/bin/sh

#设置日志文件存放目录
logs_path="/opt/server/nginx/logs/"
#设置pid文件
pid_path="${logs_path}/nginx.pid"

#重命名日志文件
mv ${logs_path}host.access.log ${logs_path}access_$(date -d "yesterday" +"%Y%m%d").log

#向nginx主进程发信号重新打开日志
kill -USR1 `cat ${pid_path}`
