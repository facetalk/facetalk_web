package com.facehu.web.controller;

import com.facehu.web.dao.UserDao;
import com.facehu.web.util.CtlHelp;
import com.facehu.web.util.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by wadang on 14-8-23.
 */
@Controller
@RequestMapping("/facesms")
public class FaceSmsController {

    @Autowired
    private UserDao userDao;

    @Value("${faceSmsGifPath}")
    private String faceSmsGifPath;


    @Value("${onlineUserUrl}")
    private String onlineUserUrl;

    @ResponseBody
    @RequestMapping(method = RequestMethod.POST, value = "/saveGif")
    public CtlHelp.AjaxResult saveGif(@RequestParam("picData") String picData, @RequestParam("gifId") String gifId) {


        String savefileName = new StringBuilder().append(faceSmsGifPath).append(File.separator)
                .append(gifId.substring(0, 2)).append(File.separator)
                .append(gifId.substring(2, 4)).append(File.separator)
                .append(gifId).append(".gif").toString();
        try {

            CtlHelp.writePicToFile(picData.substring(22), savefileName);
            return new CtlHelp.AjaxResult(CtlHelp.AjaxResult.resultState.success, "成功");
        } catch (IOException e) {
            e.printStackTrace();
            return new CtlHelp.AjaxResult(CtlHelp.AjaxResult.resultState.failure, "失败" + e.getMessage());
        }

    }

    @ResponseBody
    @RequestMapping(method = RequestMethod.GET, value = "/getUserList")
    public List<UserStatus> getUserList() {
        List<String> userlist = userDao.listUserNamesByComplete(1, true);

        List<UserStatus> userStatusList = new ArrayList<UserStatus>();

        try {
            String onlineUsers = CtlHelp.getPageHTML(onlineUserUrl, "GBK");

//            String onlineUsers = "d84bf6862bd649b8@facetalk/5280,b9938b2bb78f1edc@facetalk/5280,956e0df66aa959b4@facetalk/5280,7189910abd51e75e@facetalk/5280,5c53931e0a9f6517@facetalk/5280";

            Logger.debug(this, "获取在线用户： " + onlineUsers);

            String[] jid = onlineUsers.split(",");
            for (int i = 0; i < jid.length; i++) {
                String s = jid[i];
                String userName = s.split("@")[0];

                userlist.remove(userName);

                userStatusList.add(new UserStatus(userName, true));

            }

        } catch (Exception e) {
            e.printStackTrace();

        }

        for (String userName : userlist) {
            userStatusList.add(new UserStatus(userName, false));
        }

        return userStatusList;
    }


    public static class UserStatus {
        String userName;
        boolean isOnline;

        public UserStatus(String userName, boolean isOnline) {
            this.userName = userName;
            this.isOnline = isOnline;
        }

        public UserStatus() {
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public boolean isOnline() {
            return isOnline;
        }

        public void setOnline(boolean isOnline) {
            this.isOnline = isOnline;
        }
    }


}
