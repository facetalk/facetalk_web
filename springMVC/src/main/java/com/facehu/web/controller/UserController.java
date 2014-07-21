package com.facehu.web.controller;

import ca.mgamble.xmpp.prebind.XMPPPrebind;
import ca.mgamble.xmpp.prebind.classes.SessionInfo;
import com.facehu.web.dao.UserDao;
import com.facehu.web.model.User;
import com.facehu.web.util.CtlHelp;
import com.facehu.web.util.Logger;
import com.facehu.web.util.MD5;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.Date;

/**
 * Created by wadang on 14-7-13.
 */
@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserDao userDao;

    @Value("${bosh.jabberHost}")
    private String jabberHost;

    @Value("${bosh.xmppDomain}")
    private String xmppDomain;

    @Value("${bosh.boshPath}")
    private String boshPath;

    @Value("${bosh.boshPort}")
    private String boshPort;

    @Value("${bosh.resource}")
    private String resource;

    @Value("${bosh.useSsl}")
    private boolean useSsl;

    @Value("${bosh.debug}")
    private boolean debug;

    @Value("${avaterPath}")
    private String avaterPath;

    /**
     * 需要和nginx里的保持同步
     */
    private String password_salt = "Fear not that the life shall come to an end, but rather fear that it shall never have a beginning.";


    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/get/{userName}")
    public User printWelcome(@PathVariable String userName) {
        return userDao.getUserByName(userName);
    }


    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/register")
    public AjaxResult userRegister(User newUser) {

        //验证邮箱
        if (!CtlHelp.emailCheck(newUser.getEmail())) {

            return new AjaxResult(AjaxResult.resultState.failure, "邮箱验证错误");
        }

        String username = newUser.getEmail().replace("@", "_").replace(".", "_");

        //生成密码

        String passwordMd5 = MD5.parseStrToMd5L32(newUser.getPassword() + password_salt);
        Logger.debug(this, "passwordMd5=" + passwordMd5);

        //保存

        newUser.setUsername(username);
        newUser.setPassword(passwordMd5);
        newUser.setCreationTime(new Date());

        Logger.debug(this, "User=" + newUser.toString());


        try {
            userDao.addUser(newUser);
        } catch (Exception e) {
            Logger.info(this, "addUser exception e=" + e.getMessage());
            e.printStackTrace();
            return new AjaxResult(AjaxResult.resultState.failure, "请检查是否重复注册");
        }
        return new AjaxResult(AjaxResult.resultState.success, "基本信息注册成功");
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/savePic")
    public AjaxResult userSavePic(@RequestParam("picData") String picData, @RequestParam("username") String username) {

        Logger.debug(this, username);
        Logger.debug(this, picData);
        String fileName = avaterPath + username.substring(2) + File.pathSeparator + username + ".png";
        try {
            CtlHelp.writePicToFile(picData, fileName);
            User user = userDao.getUserByName(username);
            user.setInfoCompleteness(1); // 1完成照片这一步 0完成基本信息
            userDao.updateUser(user);

            return new AjaxResult(AjaxResult.resultState.success, "成功");
        } catch (IOException e) {
            e.printStackTrace();
            return new AjaxResult(AjaxResult.resultState.failure, "失败" + e.getMessage());
        }

    }


    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/loginForXmpp/{loginUserName}")
    public RidSidResult loginForXmpp(@PathVariable String loginUserName) {

        String jid = null, sid = null, rid = null;
        User user = userDao.getUserByName(loginUserName);
        Logger.debug(this, "loginUserName=" + loginUserName + " loginUser = " + user);


        try {

            XMPPPrebind xmppPrebind = new XMPPPrebind(jabberHost, xmppDomain, boshPath, resource, boshPort, useSsl, debug);

            Logger.debug(this, "param = " + jabberHost + xmppDomain + boshPath + resource + boshPort + useSsl + debug);
            xmppPrebind.connect(user.getUsername(), user.getPassword().trim());
//            xmppPrebind.connect("admin", "admin");
            xmppPrebind.auth();
            SessionInfo sessionInfo = xmppPrebind.getSessionInfo();
            Logger.debug(this, "jid:" + sessionInfo.getJid());
            Logger.debug(this, "sid:" + sessionInfo.getSid());
            Logger.debug(this, "rid:" + sessionInfo.getRid());

            jid = sessionInfo.getJid();
            sid = sessionInfo.getSid();
            rid = sessionInfo.getRid();


        } catch (Exception e) {
            e.printStackTrace();
        }


        return new RidSidResult(jid, sid, rid);
    }


    /**
     * 登陆返回
     */
    public static class RidSidResult {
        private String jid, sid, rid;

        public RidSidResult(String jid, String sid, String rid) {
            this.jid = jid;
            this.sid = sid;
            this.rid = rid;
        }

        public RidSidResult() {
        }

        public String getJid() {
            return jid;
        }

        public void setJid(String jid) {
            this.jid = jid;
        }

        public String getSid() {
            return sid;
        }

        public void setSid(String sid) {
            this.sid = sid;
        }

        public String getRid() {
            return rid;
        }

        public void setRid(String rid) {
            this.rid = rid;
        }
    }


    /**
     * json格式的返回状态，一般用在ajax上
     */
    public static class AjaxResult {

        public static enum resultState {
            failure,
            success
        }


        public resultState status;

        public String desc;

        public AjaxResult(resultState state, String desc) {
            this.status = state;
            this.desc = desc;
        }

        public resultState getStatus() {
            return status;
        }

        public void setStatus(resultState status) {
            this.status = status;
        }

        public String getDesc() {
            return desc;
        }

        public void setDesc(String desc) {
            this.desc = desc;
        }

        public AjaxResult() {
        }
    }


}
