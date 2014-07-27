package com.facehu.web.dao;

import com.facehu.web.model.Bill;

import java.util.List;

/**
 * Created by wadang on 14-7-26.
 */
public interface BillDao {
    public void saveOrUpdateBill(Bill bill);


    public List<Bill> listBillByUserAndProduct(String userName, String productName);


    public List<Bill> listBillByUserAndProduct(String userName, String productName, int firstResult, int maxResult);
}
