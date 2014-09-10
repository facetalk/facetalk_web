package com.facehu.web.statistic.dao.impl;

import com.facehu.web.statistic.dao.LoginLogStatDao;
import com.facehu.web.statistic.vo.LoginStat;
import com.facehu.web.util.Util;
import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * User: Administrator
 * Date: 14-9-8 下午8:30
 */

public class LoginLogStatDaoImpl implements LoginLogStatDao {
    private SessionFactory sessionFactory;

    public LoginLogStatDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    @Transactional
    public List<LoginStat> list(int startDate, int endDate, int gender, List<String> deUns) {
        if (StringUtils.length(startDate + "") != 8
                || StringUtils.length(endDate + "") != 8
                || gender < -1
                || gender > 1
                || startDate > endDate) {
            return Collections.emptyList();
        }
        StringBuilder ql = new StringBuilder();
        ql.append(" SELECT ");
        ql.append(" idate,count(distinct l.username) login_user_num,count(*) login_num");
        if (gender != Util.ALL) {
            ql.append(",gender");
        }
        ql.append(" FROM fh_login_log l LEFT OUTER JOIN fh_user u ON u.username=l.username");
        ql.append(" WHERE idate BETWEEN :startDate AND :endDate");
        if (gender != Util.ALL) {
            ql.append(" AND gender=:gender");
        }
        if (!deUns.isEmpty()) {
            ql.append(" AND l.username not in (:usernames)");
        }
        ql.append(" GROUP BY idate");
        ql.append(" ORDER by idate desc");
        Query query = sessionFactory.getCurrentSession().createSQLQuery(ql.toString());
        query.setInteger("startDate", startDate);
        query.setInteger("endDate", endDate);
        if (gender != Util.ALL) {
            query.setInteger("gender", gender);
        }
        if (!deUns.isEmpty()) {
            query.setParameterList("usernames", deUns);
        }
        List<Object[]> list = query.list();
        List<LoginStat> result = new ArrayList<>();
        for (Object[] obj : list) {
            LoginStat s = new LoginStat();
            result.add(s);
            s.setIdate(Integer.valueOf(obj[0].toString()));
            s.setLoginUserNum(Integer.valueOf(obj[1].toString()));
            s.setLoginNum(Integer.valueOf(obj[2].toString()));
            if (obj.length > 3) {
                s.setGender(Integer.valueOf(obj[3].toString()));
            }
        }
        return result;
    }


}
