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
@Table(name = "fh_product")
public class Product {

    @Id
    public String name;

    @Column(name = "price")
    public int price;

    @Column(name = "status")
    public int status;

    @Column(name = "desc")
    public String desc;

    @Column(name = "creation_time")
    public Date creationTime;


    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("Product{");
        sb.append("name='").append(name).append('\'');
        sb.append(", price=").append(price);
        sb.append(", status=").append(status);
        sb.append(", desc='").append(desc).append('\'');
        sb.append(", creation_time=").append(creationTime);
        sb.append('}');
        return sb.toString();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Date getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(Date creation_time) {
        this.creationTime = creation_time;
    }

    public Product() {
    }

    public Product(String name, int price, int status, String desc, Date creation_time) {
        this.name = name;
        this.price = price;
        this.status = status;
        this.desc = desc;
        this.creationTime = creation_time;
    }
}
