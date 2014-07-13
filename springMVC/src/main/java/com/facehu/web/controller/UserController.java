package com.facehu.web.controller;

import com.facehu.web.dao.UserDao;
import com.facehu.web.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * Created by wadang on 14-7-13.
 */
@Controller

public class UserController {
    @Autowired
    private UserDao userDao;


    @RequestMapping(method = RequestMethod.GET, value = "/getUser")
    public String printWelcome(ModelMap model) {
        List<User> listUsers = userDao.listUsers();
        model.addAttribute("users", listUsers);
        return "userList";
    }
}
