package com.facehu.web.dao;

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
    public void addUser(User user) {
        sessionFactory.getCurrentSession().save(user);
    }

    @Override
    @SuppressWarnings("unchecked")
    @Transactional
    public List<User> listUsers() {
        return sessionFactory.getCurrentSession()
                .createQuery("from User").list();
    }

    @Override
    public void updateUser(User user) {
        sessionFactory.getCurrentSession().update(user);
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public User getUserById(String username) {
        Session session = sessionFactory.getCurrentSession();
        List<User> list = session.createQuery("from User u where u.username = :username")
                .setParameter("username", username)
                .list();
        return list.size() > 0 ? (User) list.get(0) : null;
    }

}

