package com.facehu.web.controller;

import ca.mgamble.xmpp.prebind.XMPPPrebind;
import ca.mgamble.xmpp.prebind.classes.SessionInfo;
import com.facehu.web.dao.UserDao;
import com.facehu.web.model.User;
import com.facehu.web.util.CtlHelp;
import com.facehu.web.util.CtlHelp.AjaxResult;
import com.facehu.web.util.Logger;
import com.facehu.web.util.MD5;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.*;
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
        User user = userDao.getUserByName(userName);

        User returnUser = new User(user.getUsername(), "", user.getName(), user.getEmail(), user.getGender(),
                user.getSexualOrientation(), user.getIntroduction(), user.getPrice(), user.getInfoCompleteness(), null, null);
        return returnUser;
    }


    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/register")
    public CtlHelp.RegisterResult userRegister(User newUser) {

        //验证邮箱
        if (!CtlHelp.emailCheck(newUser.getEmail())) {

            return new CtlHelp.RegisterResult(CtlHelp.RegisterResult.resultState.failure, "邮箱验证错误", "");
        }

        String username = MD5.parseStrToMd5L16(newUser.getEmail());

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
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            Logger.info(this, "addUser exception e=" + e.getMessage());
            e.printStackTrace();
            return new CtlHelp.RegisterResult(CtlHelp.RegisterResult.resultState.failure, "重复注册", "");
        } catch (Exception e) {
            e.printStackTrace();

        }
        return new CtlHelp.RegisterResult(CtlHelp.RegisterResult.resultState.success, "基本信息注册成功", username);
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/savePic")
    public AjaxResult userSavePic(@RequestParam("picData") String picData, @RequestParam("username") String username) {

        Logger.debug(this, username);
//        Logger.debug(this, picData.substring(22));
        String fileName = avaterPath + File.separator + username + ".png";
        try {
            //移动旧图片
            String saveOldCil = "mv " + fileName + " " + fileName + "." + System.currentTimeMillis();
            linuxCommand(saveOldCil);

            writePicToFile(picData.substring(22), fileName);
            //裁剪图片
            String fileName40 = avaterPath + File.separator + username + ".40.png";
            String fileName100 = avaterPath + File.separator + username + ".100.png";
            linuxCommand("convert -resize 40X52 " + fileName + " " + fileName40);
            linuxCommand("convert -resize 100X130 " + fileName + " " + fileName100);

            User user = userDao.getUserByName(username);
            user.setInfoCompleteness(1); // 1完成照片这一步 0完成基本信息
            userDao.updateUser(user);

            return new AjaxResult(AjaxResult.resultState.success, "成功");
        } catch (IOException e) {
            e.printStackTrace();
            return new AjaxResult(AjaxResult.resultState.failure, "失败" + e.getMessage());
        }

    }

    private void linuxCommand(String convertCil) {
        try {
            Process p = Runtime.getRuntime().exec(convertCil);

            InputStream is = p.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            String line;
            while ((line = reader.readLine()) != null) {
                Logger.debug(this, line);
            }
            p.waitFor();
            is.close();
            reader.close();
            p.destroy();
        } catch (Exception e) {
            e.printStackTrace();
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


    public void writePicToFile(String picDate, String fileName) throws IOException {
        File file = new File(fileName);
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        FileOutputStream fop = new FileOutputStream(file);


        byte[] contentInBytes = Base64.decodeBase64(picDate);
        fop.write(contentInBytes);
        fop.flush();
        fop.close();

    }

}
