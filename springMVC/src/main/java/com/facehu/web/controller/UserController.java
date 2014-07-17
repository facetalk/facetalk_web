package com.facehu.web.controller;

import com.facehu.web.dao.UserDao;
import com.facehu.web.model.User;
import com.facehu.web.util.CtlHelp;
import com.facehu.web.util.Logger;
import com.facehu.web.util.MD5;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by wadang on 14-7-13.
 */
@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserDao userDao;

    /**
     * 需要和nginx里的保持同步
     */
    private String password_salt = "Fear not that the life shall come to an end, but rather fear that it shall never have a beginning.";


    @RequestMapping(method = RequestMethod.GET, value = "/get")
    public String printWelcome(ModelMap model) {
        List<User> listUsers = userDao.listUsers();
        model.addAttribute("users", listUsers);
        return "userList";
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/getJson")
    public List<User> printUserJson(ModelMap model) {
        List<User> listUsers = userDao.listUsers();

        return listUsers;
    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/register")
    public AjaxResult userRegister(User newUser) {

        //验证邮箱
        if (!CtlHelp.emailCheck(newUser.getEmail())) {

            return new AjaxResult(AjaxResult.resultState.failure, "邮箱验证错误");
        }

        String username = newUser.getEmail().replace("@", "_");

        //生成密码

        String passwordMd5 = MD5.parseStrToMd5L32(newUser.getPassword() + password_salt);
        Logger.debug(this, "passwordMd5=" + passwordMd5);

        //保存

        newUser.setUsername(username);
        newUser.setPassword(passwordMd5);

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
    @RequestMapping(method = RequestMethod.GET, value = "/loginForXmpp/{loginUserName}")
    public AjaxResult loginForXmpp(@PathVariable String loginUserName) {

        User user = userDao.getUserByName(loginUserName);
        Logger.debug(this, "loginUser = " + user);


        return new AjaxResult(AjaxResult.resultState.success, "基本信息注册成功");
    }


    /**
     * json格式的返回状态，一般用在ajax上
     */
    public static class AjaxResult {

        public static enum resultState {
            failure,
            success
        }


        public resultState state;

        public String desc;

        public AjaxResult(resultState state, String desc) {
            this.state = state;
            this.desc = desc;
        }

        public resultState getState() {
            return state;
        }

        public void setState(resultState state) {
            this.state = state;
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
