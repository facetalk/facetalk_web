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

    public User getUserByName(String username);

}
