package com.facehu.web.dao.impl;

import com.facehu.web.dao.ProductDao;
import com.facehu.web.model.Product;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by wadang on 14-7-26.
 */
public class ProductDaoImpl implements ProductDao {

    private SessionFactory sessionFactory;


    public ProductDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public Product getProductByName(String name) {
        Session session = sessionFactory.getCurrentSession();
        List<Product> list = session.createQuery("from Product p where p.name = :name and p.status=1")
                .setParameter("name", name)
                .list();
        return list.size() > 0 ? list.get(0) : null;
    }

}
