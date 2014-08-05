#!/bin/sh

# 更新纯web功能

# 从github上更新代码，要发布的代码首先提交github
git pull

# 拷贝到指定根目录
yes | cp -R /opt/src/facetalk_web/web /opt/facehu-web/


