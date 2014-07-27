package com.facehu.web.dao.impl;

import com.facehu.web.dao.OrderDao;
import com.facehu.web.model.Order;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by wadang on 14-7-26.
 */
public class OrderDaoImpl implements OrderDao {

    private SessionFactory sessionFactory;

    public OrderDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    @Transactional
    public void addOrder(Order order) {
        sessionFactory.getCurrentSession().saveOrUpdate(order);
    }

    @Override
    @Transactional

    public void updateOrder(Order order) {
        sessionFactory.getCurrentSession().update(order);

    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public List<Order> listOrdersByUserName(String userName) {

        Session session = sessionFactory.getCurrentSession();
        List<Order> list = session.createQuery("from Order o where o.username = :username")
                .setParameter("username", userName)
                .list();
        return list;
    }


    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public List<Order> listOrdersByUserName(String userName, int firstResult, int maxResult) {

        Session session = sessionFactory.getCurrentSession();
        List<Order> list = session.createQuery("from Order o where o.username = :username")
                .setParameter("username", userName)
                .setFirstResult(firstResult)
                .setMaxResults(maxResult)
                .list();
        return list;
    }


    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public List<Order> listOrdersByUserName(String userName, int payStatus) {

        Session session = sessionFactory.getCurrentSession();
        List<Order> list = session.createQuery("from Order o where o.username = :username and o.payStatus = :payStatus")
                .setParameter("username", userName)
                .setParameter("payStatus", payStatus)
                .list();
        return list;
    }


    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public List<Order> listOrdersByUserName(String userName, int payStatus, int firstResult, int maxResult) {

        Session session = sessionFactory.getCurrentSession();
        List<Order> list = session.createQuery("from Order o where o.username = :username and o.payStatus = :payStatus")
                .setParameter("username", userName)
                .setParameter("payStatus", payStatus)
                .setFirstResult(firstResult)
                .setMaxResults(maxResult)
                .list();
        return list;
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public Order getOrderById(String id) {

        Session session = sessionFactory.getCurrentSession();
        List<Order> list = session.createQuery("from Order o where o.id = :id ")
                .setParameter("id", id)
                .list();
        return list.size() > 0 ? list.get(0) : null;

    }
}
