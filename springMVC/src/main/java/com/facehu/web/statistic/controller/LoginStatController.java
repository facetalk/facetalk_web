package com.facehu.web.statistic.controller;

import com.facehu.web.statistic.dao.LoginLogStatDao;
import com.facehu.web.util.Util;
import com.mysql.jdbc.StringUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;
import java.util.List;

/**
 * User: Administrator
 * Date: 14-9-8 下午8:01
 */
@Controller
@RequestMapping("/loginStat")
public class LoginStatController {

    @Autowired
    private LoginLogStatDao loginLogStatDao;

    @Value("${deprecate.usernames}")
    private String deUsernames;

    private final String STAT_PAGE = "stat";

    @RequestMapping(method = RequestMethod.GET, value = "/stat/{startDate}/{endDate}/{gender}")
    public String stat(@PathVariable int startDate, @PathVariable int endDate, @PathVariable int gender, ModelMap model) {
        List<String> deUns = new ArrayList<>();
        if (!StringUtils.isNullOrEmpty(deUsernames)) {
            String[] uns = deUsernames.split(Util.COMMA);
            for (String un : uns) {
                deUns.add(un);
            }
        }
        model.addAttribute("stats", JSONArray.fromObject(loginLogStatDao.list(startDate, endDate, gender, deUns)));
        return STAT_PAGE;
    }
}
