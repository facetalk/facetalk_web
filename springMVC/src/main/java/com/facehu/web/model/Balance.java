package com.facehu.web.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wadang on 14-7-26.
 */

@Entity
@Table(name = "fh_balance")
public class Balance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public String id;

    @Column(name = "username")
    public String username;

    @Column(name = "product_name")
    public String productName;

    @Column(name = "current_amount")
    public int productAmount;

    @Version
    @Column(name = "version")
    public int version;

    @Column(name = "creation_time")
    public Date creationTime;

    @Column(name = "modification_time")
    public Date modificationTime;

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("Balance{");
        sb.append("id='").append(id).append('\'');
        sb.append(", username='").append(username).append('\'');
        sb.append(", productName='").append(productName).append('\'');
        sb.append(", productAmount=").append(productAmount);
        sb.append(", version=").append(version);
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

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
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

    public Balance() {
    }
}
