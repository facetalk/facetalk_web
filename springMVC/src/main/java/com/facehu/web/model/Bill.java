package com.facehu.web.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wadang on 14-7-26.
 */


@Entity
@Table(name = "fh_bill")
public class Bill {

    public static int BILL_TYPE_ADD = 1;
    public static int BILL_TYPE_SUB = 2;


    public static int GAIN_WAY_PAY = 1;//购买获得
    public static int GAIN_WAY_GRANT = 2; //赠予
    public static int GAIN_WAY_CONSUME = 3; //正常消费
    public static int GAIN_WAY_SYS_TAKEOUT = 4;//系统扣除

    public static int FLAG_NORMAL = 0;         //正常
    public static int FLAG_CONSUME_FREEZE = 1;  // 消费冻结
    public static int FLAG_FREEZE_CANCEL = 2;   //消费冻结取消（等于这条记录不存在）


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public String id;

    @Column(name = "username")
    public String username;

    @Column(name = "product_name")
    public String productName;

    @Column(name = "product_amount")
    public int productAmount;

    @Column(name = "type")
    public int type;

    @Column(name = "gain_way")
    public int gainWay;

    @Column(name = "correlation_id")
    public String correlationId;

    @Column(name = "bill_desc")
    public String desc;

    @Column(name = "flag")
    public int flag;

    @Column(name = "creation_time")
    public Date creationTime;

    @Column(name = "modification_time")
    public Date modificationTime;

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("Bill{");
        sb.append("id='").append(id).append('\'');
        sb.append(", username='").append(username).append('\'');
        sb.append(", productName='").append(productName).append('\'');
        sb.append(", productAmount=").append(productAmount);
        sb.append(", type=").append(type);
        sb.append(", gainWay=").append(gainWay);
        sb.append(", correlationId='").append(correlationId).append('\'');
        sb.append(", desc='").append(desc).append('\'');
        sb.append(", flag=").append(flag);
        sb.append(", creationTime=").append(creationTime);
        sb.append(", modificationTime=").append(modificationTime);
        sb.append('}');
        return sb.toString();
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

    public int getProductAmount() {
        return productAmount;
    }

    public void setProductAmount(int productAmount) {
        this.productAmount = productAmount;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getGainWay() {
        return gainWay;
    }

    public void setGainWay(int gainWay) {
        this.gainWay = gainWay;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
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

    public Bill() {
    }
}

