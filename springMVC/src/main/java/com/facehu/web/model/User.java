package com.facehu.web.model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wadang on 14-7-13.
 */

@Entity
@Table(name = "fh_user")
public class User {

    @Id
    @Column(name = "username")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "gender")
    private int gender;

    @Column(name = "sexual_orientation")
    private int sexualOrientation;

    @Column(name = "introduction")
    private int introduction;

    @Column(name = "creation_time")
    private Date creationTime;

    @Column(name = "modification_time")
    private Date modificationTime;

    public User() {


    }

    public User(String username, String password, String name, String email, int gender, int sexualOrientation, int introduction) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.gender = gender;
        this.sexualOrientation = sexualOrientation;
        this.introduction = introduction;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (username != null ? !username.equals(user.username) : user.username != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return username != null ? username.hashCode() : 0;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }

    public int getSexualOrientation() {
        return sexualOrientation;
    }

    public void setSexualOrientation(int sexualOrientation) {
        this.sexualOrientation = sexualOrientation;
    }

    public int getIntroduction() {
        return introduction;
    }

    public void setIntroduction(int introduction) {
        this.introduction = introduction;
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
}
