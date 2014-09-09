package com.facehu.web.statistic.model;

import javax.persistence.*;

/**
 * User: Administrator
 * Date: 14-9-8 下午8:02
 */
@Entity
@Table(name = "fh_login_log")
public class LoginLogStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(name = "username")
    private String username;

    @Column(name = "idate")
    private int idate;

    @Column(name = "create_time")
    private String createTime;

    @Column(name = "ip")
    private String ip;

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

    public int getIdate() {
        return idate;
    }

    public void setIdate(int idate) {
        this.idate = idate;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }
}
