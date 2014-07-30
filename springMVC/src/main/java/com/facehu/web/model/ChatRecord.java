package com.facehu.web.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wadang on 14-7-30.
 */
@Entity
@Table(name = "fh_chat_record")
public class ChatRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;

    /**
     * 呼叫方
     */
    @Column(name = "calling_username")
    public String callingUserName;

    /**
     * 被叫方
     */
    @Column(name = "called_username")
    public String calledUserName;


    @Column(name = "spend_productname")
    public String spendProductName;

    @Column(name = "spend_productamount")
    public int spendProductAmount;


    @Column(name = "begin_time")
    public Date beginTime;

    @Column(name = "finish_time")
    public Date finish_time;

    /**
     * 主叫方是否删除 1是，0否
     */
    @Column(name = "is_calling_del")
    public int isCallingDel;

    /**
     * 被叫方是否删除 1是，0否
     */
    @Column(name = "is_called_del")
    public int isCalledDel;


    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("ChatRecord{");
        sb.append("id='").append(id).append('\'');
        sb.append(", callingUserName='").append(callingUserName).append('\'');
        sb.append(", calledUserName='").append(calledUserName).append('\'');
        sb.append(", spendProductName='").append(spendProductName).append('\'');
        sb.append(", spendProductAmount=").append(spendProductAmount);
        sb.append(", beginTime=").append(beginTime);
        sb.append(", finish_time=").append(finish_time);
        sb.append(", isCallingDel=").append(isCallingDel);
        sb.append(", isCalledDel=").append(isCalledDel);
        sb.append('}');
        return sb.toString();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCallingUserName() {
        return callingUserName;
    }

    public void setCallingUserName(String callingUserName) {
        this.callingUserName = callingUserName;
    }

    public String getCalledUserName() {
        return calledUserName;
    }

    public void setCalledUserName(String calledUserName) {
        this.calledUserName = calledUserName;
    }

    public String getSpendProductName() {
        return spendProductName;
    }

    public void setSpendProductName(String spendProductName) {
        this.spendProductName = spendProductName;
    }

    public int getSpendProductAmount() {
        return spendProductAmount;
    }

    public void setSpendProductAmount(int spendProductAmount) {
        this.spendProductAmount = spendProductAmount;
    }

    public Date getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(Date beginTime) {
        this.beginTime = beginTime;
    }

    public Date getFinish_time() {
        return finish_time;
    }

    public void setFinish_time(Date finish_time) {
        this.finish_time = finish_time;
    }

    public int getIsCallingDel() {
        return isCallingDel;
    }

    public void setIsCallingDel(int isCallingDel) {
        this.isCallingDel = isCallingDel;
    }

    public int getIsCalledDel() {
        return isCalledDel;
    }

    public void setIsCalledDel(int isCalledDel) {
        this.isCalledDel = isCalledDel;
    }

    public ChatRecord() {
    }

    public ChatRecord(String callingUserName, String calledUserName, String spendProductName, int spendProductAmount, Date beginTime, Date finish_time, int isCallingDel, int isCalledDel) {
        this.callingUserName = callingUserName;
        this.calledUserName = calledUserName;
        this.spendProductName = spendProductName;
        this.spendProductAmount = spendProductAmount;
        this.beginTime = beginTime;
        this.finish_time = finish_time;
        this.isCallingDel = isCallingDel;
        this.isCalledDel = isCalledDel;
    }
}
