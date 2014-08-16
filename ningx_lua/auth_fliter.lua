--
-- Created by IntelliJ IDEA.
-- User: wadang
-- Date: 14-7-6
-- Time: 下午1:11
-- To change this template use File | Settings | File Templates.
--

local authoCookieName = "_fh_autho"
local authsessionCookieName = "_fh_authsession"
local usernameCookieName = "_fh_username"
local autho = ngx.var["cookie_" .. authoCookieName]
local authsession = ngx.var["cookie_" .. authsessionCookieName]
local username = ngx.var["cookie_" .. usernameCookieName]

if username == nil or autho == nil or authsession == nil then
    ngx.exit(ngx.HTTP_FORBIDDEN)
    return
end



local redis_res = ngx.location.capture("/redis_get?key=" .. username)


--for key, value in pairs(redis_res) do
--- -    ngx.say(key.."|"..value)
---- end
-- 解析响应
local parser = require 'redis.parser'
local res, typ = parser.parse_reply(redis_res.body)

if res == autho .. "|" .. authsession then
    ngx.exit(ngx.HTTP_OK)
else
    ngx.exit(ngx.HTTP_FORBIDDEN)
end


