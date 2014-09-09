package com.facehu.web.statistic.dao;

import com.facehu.web.statistic.vo.LoginStat;

import java.util.List;

/**
 * User: Administrator
 * Date: 14-9-8 下午8:49
 */
public interface LoginLogStatDao {
    List<LoginStat> list(int startDate, int endDate, int gender, List<String> deUns);
}
