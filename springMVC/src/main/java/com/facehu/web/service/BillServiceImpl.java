package com.facehu.web.service;

import com.facehu.web.dao.BalanceDao;
import com.facehu.web.dao.BillDao;
import com.facehu.web.model.Balance;
import com.facehu.web.model.Bill;
import org.springframework.beans.factory.annotation.Autowired;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

/**
 * Created by wadang on 14-7-26.
 */
public class BillServiceImpl implements BillService {

    @Autowired
    private BillDao billDao;

    @Autowired
    private BalanceDao balanceDao;


    @Override
    @Transactional
    public List<Bill> listBillByUserAndProduct(String userName, String productName, int firstResult, int maxResult) {
        if (maxResult == 0) {
            return billDao.listBillByUserAndProduct(userName, productName);
        } else {
            return billDao.listBillByUserAndProduct(userName, productName, firstResult, maxResult);
        }
    }

    @Override
    @Transactional
    public Balance getBalanceByUserAndProduct(String userName, String productName) {
        return balanceDao.getBalanceByUserAndProduct(userName, productName);
    }


    /**
     * 系统赠予
     *
     * @param userName
     * @param productName
     * @param productAmount
     * @param adminName     操作的管理人
     */
    @Override
    @Transactional
    public void systemGrant(String userName, String productName, int productAmount,
                            String adminName, String desc) {

        Bill bill = new Bill();
        bill.setProductAmount(productAmount);
        bill.setCreationTime(new Date());
        bill.setUsername(userName);
        bill.setProductName(productName);
        bill.setCorrelationId(adminName + "_" + System.currentTimeMillis());
        bill.setDesc(desc);
        bill.setFlag(Bill.FLAG_NORMAL);
        bill.setGainWay(Bill.GAIN_WAY_GRANT);

        boolean conflict = false;

        do {
            try {
                createBillandupdateBalance(bill);
            } catch (org.hibernate.StaleObjectStateException e) {
                conflict = true;
                e.printStackTrace();
            }

        } while (conflict);


    }

    /**
     * 当前账户不可以小于零
     *
     * @param bill
     */
    @Transactional
    private void createBillandupdateBalance(Bill bill) {

        billDao.saveOrUpdateBill(bill);

        String userName = bill.getUsername();
        String productName = bill.getProductName();

        Balance balance = balanceDao.getBalanceByUserAndProduct(userName, productName);

        if (balance == null) {
            balance = new Balance();
            balance.setUsername(userName);
            balance.setProductName(productName);
            balance.setProductAmount(0);
            balance.setCreationTime(new Date());
        }

        balance.setProductAmount(balance.getProductAmount() + bill.getProductAmount());

        balanceDao.saveOrUpdate(balance);

        if (balance.getProductAmount() < 0) {
            throw new java.lang.IllegalStateException("balance state illegal");
        }
    }


}
