package com.facehu.web.dao;

import com.facehu.web.model.Balance;

/**
 * Created by wadang on 14-7-26.
 */
public interface BalanceDao {

    public void saveOrUpdate(Balance balance);

    public Balance getBalanceByUserAndProduct(String userName, String productName);

}
