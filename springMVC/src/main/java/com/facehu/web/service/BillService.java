package com.facehu.web.service;

import com.facehu.web.model.Balance;
import com.facehu.web.model.Bill;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by wadang on 14-7-27.
 */
public interface BillService {
    @Transactional
    List<Bill> listBillByUserAndProduct(String userName, String productName, int firstResult, int maxResult);

    @Transactional
    Balance getBalanceByUserAndProduct(String userName, String productName);

    void systemGrant(String userName, String productName, int productAmount,
                     String adminName, String desc);

    void expense(String userName, String productName, String beConsumedUser, int productAmount, String desc);
}