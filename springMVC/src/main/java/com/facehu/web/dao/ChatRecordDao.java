package com.facehu.web.dao;

import com.facehu.web.model.ChatRecord;

import java.util.List;

/**
 * Created by wadang on 14-7-30.
 */
public interface ChatRecordDao {


    ChatRecord getChatRecord(int id);


    void saveOrUpdate(ChatRecord chatRecord);

    @SuppressWarnings("unchecked")
    List<ChatRecord> listChatRecordByUser(String userName, int firstResult, int maxResult);


    List<ChatRecord> listChatRecords(int firstResult, int maxResult);
}
