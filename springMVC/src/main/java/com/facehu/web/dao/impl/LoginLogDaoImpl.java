package com.facehu.web.dao.impl;

import com.facehu.web.model.LoginLog;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by wadang on 14-8-20.
 */
public class LoginLogDaoImpl implements com.facehu.web.dao.LoginLogDao {

    private SessionFactory sessionFactory;

    public LoginLogDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    @Override
    @Transactional
    public void save(LoginLog loginLog) {
        sessionFactory.getCurrentSession().save(loginLog);
    }


    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public List<LoginLog> listLoginLog(int firstResult, int maxResult) {

        Session session = sessionFactory.getCurrentSession();
        List<LoginLog> list = session.createQuery("from LoginLog l order by l.loginTime desc ")
                .setFirstResult(firstResult)
                .setMaxResults(maxResult)
                .list();
        return list;
    }


    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public List<LoginLog> listLoginLogByUserName(String userName, int firstResult, int maxResult) {

        Session session = sessionFactory.getCurrentSession();
        List<LoginLog> list = session.createQuery("from LoginLog l  where l.username = :username " +
                "order by l.loginTime desc ")
                .setParameter("username", userName)
                .setFirstResult(firstResult)
                .setMaxResults(maxResult)
                .list();
        return list;
    }


}
