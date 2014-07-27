package com.facehu.web.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * Created by wadang on 14-7-26.
 */
@Entity
@Table(name = "fh_order")
public class Order {

    @Id
    public String id;

    @Column(name = "username")
    public String username;

    @Column(name = "product_name")
    public String productName;

    @Column(name = "product_desc")
    public String productDesc;

    @Column(name = "product_amount")
    public int productAmount;

    @Column(name = "total_cost")
    public int totalCost;

    @Column(name = "pay_status")
    public int payStatus;

    @Column(name = "bank")
    public String bank;

    @Column(name = "pay_way")
    public int payWay;

    @Column(name = "order_desc")
    public String orderDesc;

    @Column(name = "creation_time")
    public Date creationTime;

    @Column(name = "modification_time")
    public Date modificationTime;


    public String getPayStatusDesc() {
        String desc = "";
        switch (this.payStatus) {
            case 0:
                desc = "未确认";
                break;
            case 1:
                desc = "已提交支付";
                break;
            case 2:
                desc = "支付成功";
                break;
            case 3:
                desc = "支付失败";
                break;
        }
        return desc;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDesc() {
        return productDesc;
    }

    public void setProductDesc(String productDesc) {
        this.productDesc = productDesc;
    }

    public int getProductAmount() {
        return productAmount;
    }

    public void setProductAmount(int productAmount) {
        this.productAmount = productAmount;
    }

    public int getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(int totalCost) {
        this.totalCost = totalCost;
    }

    public int getPayStatus() {
        return payStatus;
    }

    public void setPayStatus(int payStatus) {
        this.payStatus = payStatus;
    }

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public int getPayWay() {
        return payWay;
    }

    public void setPayWay(int payWay) {
        this.payWay = payWay;
    }

    public String getOrderDesc() {
        return orderDesc;
    }

    public void setOrderDesc(String orderDesc) {
        this.orderDesc = orderDesc;
    }

    public Date getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(Date creationTime) {
        this.creationTime = creationTime;
    }

    public Date getModificationTime() {
        return modificationTime;
    }

    public void setModificationTime(Date modificationTime) {
        this.modificationTime = modificationTime;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("Order{");
        sb.append("id='").append(id).append('\'');
        sb.append(", username='").append(username).append('\'');
        sb.append(", productName='").append(productName).append('\'');
        sb.append(", productDesc='").append(productDesc).append('\'');
        sb.append(", productAmount=").append(productAmount);
        sb.append(", totalCost=").append(totalCost);
        sb.append(", payStatus=").append(payStatus);
        sb.append(", bank='").append(bank).append('\'');
        sb.append(", payWay=").append(payWay);
        sb.append(", orderDesc='").append(orderDesc).append('\'');
        sb.append(", creationTime=").append(creationTime);
        sb.append(", modificationTime=").append(modificationTime);
        sb.append('}');
        return sb.toString();
    }

    public Order() {
    }
}
