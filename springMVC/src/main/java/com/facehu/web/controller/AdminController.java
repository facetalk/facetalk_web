package com.facehu.web.controller;

import com.facehu.web.dao.ChatRecordDao;
import com.facehu.web.dao.LoginLogDao;
import com.facehu.web.dao.UserDao;
import com.facehu.web.model.ChatRecord;
import com.facehu.web.model.LoginLog;
import com.facehu.web.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by wadang on 14-8-19.
 */
@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserDao userDao;

    @Autowired
    private LoginLogDao loginLogDao;

    @Autowired
    private ChatRecordDao chatRecordDao;

    @Value("${avaterPath}")
    private String avaterPath;

    @RequestMapping(method = RequestMethod.GET, value = "/userWall")
    public String userWall(ModelMap model) {
        List<User> listUsers = userDao.listUsers();
        model.addAttribute("users", listUsers);
        return "userList";
    }

    @RequestMapping(method = RequestMethod.GET, value = "/loginLog/{begin}/{maxNum}")
    public String loginLog(@PathVariable int begin, @PathVariable int maxNum, ModelMap model) {
        List<LoginLog> list = loginLogDao.listLoginLog(begin, maxNum);
        model.addAttribute("logs", list);
        return "loginlogs";
    }

    @RequestMapping(method = RequestMethod.GET, value = "/loginLogByUser/{username}")
    public String loginLog(@PathVariable String username, ModelMap model) {
        List<LoginLog> list = loginLogDao.listLoginLogByUserName(username, 0, 1000);
        model.addAttribute("userlogs", list);
        return "userlogs";
    }

    @RequestMapping(method = RequestMethod.GET, value = "/chatRecords/{begin}/{maxNum}")
    public String chatRecords(@PathVariable int begin, @PathVariable int maxNum, ModelMap model) {
        List<ChatRecord> list = chatRecordDao.listChatRecords(begin, maxNum);
        model.addAttribute("chatRecords", list);
        return "chatRecords";
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/deletePic/{username}/{status}")
    public String deletePic(@PathVariable String username, @PathVariable int status) {
        User user = userDao.getUserByName(username);
        user.setInfoCompleteness(status); // 1完成照片这一步 0完成基本信息
        userDao.updateUser(user);
        return "ok";
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/deleteUser/{username}")
    public String deleteUser(@PathVariable String username) {
        User user = userDao.getUserByName(username);
        user.setStatus(0); // 1正常 0删除
        userDao.updateUser(user);
        return "ok";
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/recoverUser/{username}")
    public String recoverUser(@PathVariable String username) {
        User user = userDao.fetchUserByName(username);
        user.setStatus(1); // 1正常 0删除
        userDao.updateUser(user);
        return "ok";
    }


    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/setGender/{username}/{gender}")
    public String setGender(@PathVariable String username, @PathVariable int gender) {
        User user = userDao.getUserByName(username);
        user.setGender(gender); // 1正常 0删除
        userDao.updateUser(user);
        return "ok";
    }


}
