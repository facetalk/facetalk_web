package com.facehu.web.controller;

import com.facehu.web.dao.LoginLogDao;
import com.facehu.web.dao.UserDao;
import com.facehu.web.model.LoginLog;
import com.facehu.web.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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
        List<LoginLog> list = loginLogDao.listLoginLogByUserName(username, 1, 1000);
        model.addAttribute("userlogs", list);
        return "userlogs";
    }


}
