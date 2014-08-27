package com.facehu.web.dao.impl;

import com.facehu.web.dao.UserDao;
import com.facehu.web.model.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by wadang on 14-7-13.
 */
public class UserDaoImpl implements UserDao {

    private SessionFactory sessionFactory;

    public UserDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    @Transactional
    public void addUser(User user) {
        sessionFactory.getCurrentSession().save(user);
    }

    @Override
    @SuppressWarnings("unchecked")
    @Transactional
    public List<User> listUsers() {
        return sessionFactory.getCurrentSession()
                .createQuery("from User u order by u.creationTime desc ").list();
    }

    @Override
    @SuppressWarnings("unchecked")
    @Transactional
    public List<String> listUserNamesByComplete(int infoCompleteness, boolean isDesc) {
        String sql = "select u.username from User u where u.status=1 and u.infoCompleteness = :infoCompleteness order by u.creationTime  ";


        if (isDesc) {
            sql = sql + "desc";
        }


        return sessionFactory.getCurrentSession()
                .createQuery(sql).setParameter("infoCompleteness", infoCompleteness).list();

    }


    @Override
    @Transactional
    public void updateUser(User user) {
        sessionFactory.getCurrentSession().update(user);
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public User getUserByName(String username) {
        Session session = sessionFactory.getCurrentSession();
        List<User> list = session.createQuery("from User u where u.status=1 and u.username = :username")
                .setParameter("username", username)
                .list();
        return list.size() > 0 ? list.get(0) : null;
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public User fetchUserByName(String username) {
        Session session = sessionFactory.getCurrentSession();
        List<User> list = session.createQuery("from User u where u.username = :username")
                .setParameter("username", username)
                .list();
        return list.size() > 0 ? list.get(0) : null;
    }

}

