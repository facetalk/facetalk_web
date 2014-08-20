package com.facehu.web.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wadang on 14-8-20.
 */

@Entity
@Table(name = "fh_user_login_log")
public class LoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "username")
    private String username;

    @Column(name = "ip")
    private String ip;

    @Column(name = "login_time")
    private Date loginTime;

    @Column(name = "info_completeness")
    private int infoCompleteness;

    @Column(name = "name")
    private String name;

    /**
     * @param username
     * @param ip
     * @param loginTime
     * @param infoCompleteness
     * @param name
     */
    public LoginLog(String username, String ip, Date loginTime, int infoCompleteness, String name) {
        this.username = username;
        this.ip = ip;
        this.loginTime = loginTime;
        this.infoCompleteness = infoCompleteness;
        this.name = name;
    }

    public int getInfoCompleteness() {
        return infoCompleteness;
    }

    public void setInfoCompleteness(int infoCompleteness) {
        this.infoCompleteness = infoCompleteness;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LoginLog() {
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("LoginLog{");
        sb.append("id=").append(id);
        sb.append(", username='").append(username).append('\'');
        sb.append(", ip='").append(ip).append('\'');
        sb.append(", loginTime=").append(loginTime);
        sb.append(", infoCompleteness=").append(infoCompleteness);
        sb.append(", name='").append(name).append('\'');
        sb.append('}');
        return sb.toString();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Date getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(Date loginTime) {
        this.loginTime = loginTime;
    }
}
