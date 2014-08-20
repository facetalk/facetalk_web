package com.facehu.web.dao;

import com.facehu.web.model.LoginLog;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by wadang on 14-8-20.
 */
public interface LoginLogDao {
    @Transactional
    void save(LoginLog loginLog);

    @Transactional
    @SuppressWarnings("unchecked")
    List<LoginLog> listLoginLog(int firstResult, int maxResult);

    @Transactional
    @SuppressWarnings("unchecked")
    List<LoginLog> listLoginLogByUserName(String userName, int firstResult, int maxResult);
}
