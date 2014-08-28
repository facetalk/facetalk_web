package com.facehu.web.dao;

import com.facehu.web.model.User;

import java.util.List;

/**
 * Created by wadang on 14-7-13.
 */
public interface UserDao {

    public void addUser(User user);

    public void updateUser(User user);

    public List<User> listUsers();


    /**
     * 根据用户的完成度排序
     *
     * @param isDesc
     * @return
     */
    public List<String> listUserNamesByComplete(int infoCompleteness, boolean isDesc);

    public List<String> listUserNamesByCompleteAndGender(int infoCompleteness, boolean isDesc);


    public User getUserByName(String username);

    public User fetchUserByName(String username);

}
