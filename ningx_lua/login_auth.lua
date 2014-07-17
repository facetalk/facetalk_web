--
-- Created by IntelliJ IDEA.
-- User: wadang
-- Date: 14-7-5
-- Time: 下午5:38
-- To change this template use File | Settings | File Templates.
--


local password_salt = "Fear not that the life shall come to an end, but rather fear that it shall never have a beginning."
local cookie_salt = "The greatest test of courage on earth is to bear defeat without losing heart."
local authoCookieName = "_ft_autho"
local authsessionCookieName = "_ft_authsession"
local usernameCookieName = "_ft_username"

--1、先从post请求中得到用户名密码

--ngx.say(ngx.var.loginUserName)
--ngx.say(ngx.var.loginPassword)
--ngx.say("-|------|-")
local passwordMd5 = ngx.md5(ngx.var.loginPassword .. password_salt)
ngx.say(passwordMd5)
--2、加密后去数据库中验证
local mysql = require "resty.mysql"
local db, err = mysql:new()
if not db then
    ngx.print("failed to instantiate mysql: ", err)
    return
end

db:set_timeout(10000)

local ok, err, errno, sqlstate = db:connect {
    host = "127.0.0.1",
    port = 3306,
    database = "facetalk",
    user = "root",
    max_packet_size = 1024 * 1024
}

if not ok then
    ngx.say("failed to connect: ", err, ": ", errno, " ", sqlstate)
    return
end

local username = ngx.unescape_uri(ngx.var.loginUserName)
local quoted_name = ngx.quote_sql_str(username)
local sql = "select username,password from user_test where username = " .. quoted_name

local res, err, errno, sqlstate =
db:query(sql)
if not res then
    ngx.say("bad result: ", err, ": ", errno, ": ", sqlstate, ".")
    return
end

if table.getn(res) == 0 then
    -- todo 提示登陆失败
    ngx.say("查无此人")
    return
end
--ngx.say(res[1].username .. "|" .. res[1].password)
if res[1].password ~= passwordMd5 then
    -- todo 提示登陆失败
    ngx.say("密码或用户名不对");
    return
end
local ok, err = db:set_keepalive(10000, 100)
if not ok then
    ngx.say("failed to set keepalive: ", err)
    return
end

--3、正确则生成cookie，存入redis，不正确则跳转

local autho = ngx.md5(username .. passwordMd5 .. cookie_salt)
local authsession = ngx.md5(ngx.now() .. username .. ngx.var.remote_addr .. cookie_salt)

local usernameCookie = usernameCookieName .. '=' .. username .. ';path=/;Expires=' .. ngx.cookie_time(ngx.now() + 60 * 60 * 24 * 356)
local setcookieBase = 'path=/;HTTPOnly;Expires=' .. ngx.cookie_time(ngx.now() + 60 * 60 * 24 * 14)
local authoCookie = authoCookieName .. '=' .. autho .. ';' .. setcookieBase
local authsessionCookie = authsessionCookieName .. '=' .. authsession .. ';' .. setcookieBase

local clearCookieBase = 'MaxAge=0;Expires=' .. ngx.cookie_time(ngx.now() - (60 * 60 * 24 * 14))
--set-cookie要在任何输出之前设置
ngx.header['Set-Cookie'] = { usernameCookie, authoCookie, authsessionCookie }

--存入redis
local redis_res = ngx.location.capture("/redis_set?key=" .. username .. "&val=" .. autho .. "|" .. authsession)
ngx.say(redis_res.body)
res = ngx.location.capture("/ok.html")

ngx.print(res.body)


