package com.facehu.web.dao.impl;

import com.facehu.web.dao.BillDao;
import com.facehu.web.model.Bill;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.util.List;

/**
 * Created by wadang on 14-7-26.
 * 封装到service层，不可独立调用
 */
public class BillDaoImpl implements BillDao {

    private SessionFactory sessionFactory;


    public BillDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    /**
     * 对账单的更新必然有对账户余额的更新
     *
     * @param bill
     */
    public void saveOrUpdateBill(Bill bill) {
        this.sessionFactory.getCurrentSession().saveOrUpdate(bill);
    }


    @SuppressWarnings("unchecked")
    public List<Bill> listBillByUserAndProduct(String userName, String productName) {

        Session session = sessionFactory.getCurrentSession();
        List<Bill> list = session.createQuery("from Bill b where b.username = :username and b.productName = :productName")
                .setParameter("username", userName)
                .setParameter("productName", productName)
                .list();
        return list;
    }


    @SuppressWarnings("unchecked")
    public List<Bill> listBillByUserAndProduct(String userName, String productName, int firstResult, int maxResult) {
        Session session = sessionFactory.getCurrentSession();
        List<Bill> list = session.createQuery("from Bill b where b.username = :username and b.productName = :productName")
                .setParameter("username", userName)
                .setParameter("productName", productName)
                .setFirstResult(firstResult)
                .setMaxResults(maxResult)
                .list();
        return list;
    }


}
