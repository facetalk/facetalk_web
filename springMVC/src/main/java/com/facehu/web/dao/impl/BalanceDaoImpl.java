package com.facehu.web.dao.impl;

import com.facehu.web.dao.BalanceDao;
import com.facehu.web.model.Balance;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.util.List;

/**
 * Created by wadang on 14-7-26.
 * 封装到service层，不可独立调用
 */
public class BalanceDaoImpl implements BalanceDao {
    private SessionFactory sessionFactory;


    public BalanceDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    public void saveOrUpdate(Balance balance) {
        this.sessionFactory.getCurrentSession().saveOrUpdate(balance);
    }

    public Balance getBalanceByUserAndProduct(String userName, String productName) {

        Session session = sessionFactory.getCurrentSession();
        List<Balance> list = session.createQuery("from Balance b where b.username = :username and b.productName = :productName")
                .setParameter("username", userName)
                .setParameter("productName", productName)
                .list();
        return list.size() > 0 ? list.get(0) : null;
    }
}
