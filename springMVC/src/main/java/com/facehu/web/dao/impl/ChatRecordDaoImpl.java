package com.facehu.web.dao.impl;

import com.facehu.web.dao.ChatRecordDao;
import com.facehu.web.model.ChatRecord;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by wadang on 14-7-30.
 */
public class ChatRecordDaoImpl implements ChatRecordDao {


    private SessionFactory sessionFactory;


    public ChatRecordDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    @Override
    @Transactional
    public ChatRecord getChatRecord(int id) {
        Session session = sessionFactory.getCurrentSession();
        List<ChatRecord> list = session.createQuery("from ChatRecord o where o.id = :id ")
                .setParameter("id", id)
                .list();
        return list.size() > 0 ? list.get(0) : null;
    }


    @Override
    @Transactional
    public void saveOrUpdate(ChatRecord chatRecord) {
        this.sessionFactory.getCurrentSession().saveOrUpdate(chatRecord);
    }


    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public List<ChatRecord> listChatRecordByUser(String userName, int firstResult, int maxResult) {
        Session session = sessionFactory.getCurrentSession();
        List<ChatRecord> list = session.createQuery("from ChatRecord c where c.calledUserName = :userName or c.callingUserName = :userName  order by c.beginTime   desc ")
                .setParameter("userName", userName)
                .setFirstResult(firstResult)
                .setMaxResults(maxResult)
                .list();
        return list;
    }

    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public List<ChatRecord> listChatRecords(int firstResult, int maxResult) {
        Session session = sessionFactory.getCurrentSession();
        List<ChatRecord> list = session.createQuery("from ChatRecord c  order by c.beginTime   desc ")
                .setFirstResult(firstResult)
                .setMaxResults(maxResult)
                .list();
        return list;
    }
}
