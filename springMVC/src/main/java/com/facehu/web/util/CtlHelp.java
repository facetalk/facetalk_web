package com.facehu.web.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by wadang on 14-7-15.
 */

public class CtlHelp {

    /**
     * 邮箱验证
     *
     * @param email
     * @return
     */
    public static boolean emailCheck(String email) {
        String check = "^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
        Pattern regex = Pattern.compile(check);
        Matcher matcher = regex.matcher(email);
        return matcher.matches();
    }


    /**
     * json格式的返回状态，一般用在ajax上
     */
    public static class AjaxResult {

        public static enum resultState {
            failure,
            success
        }


        public resultState status;

        public String desc;

        public AjaxResult(resultState state, String desc) {
            this.status = state;
            this.desc = desc;
        }

        public resultState getStatus() {
            return status;
        }

        public void setStatus(resultState status) {
            this.status = status;
        }

        public String getDesc() {
            return desc;
        }

        public void setDesc(String desc) {
            this.desc = desc;
        }

        public AjaxResult() {
        }
    }


    public static class CreateOrderResult extends AjaxResult {
        public String orderId;

        public CreateOrderResult(resultState state, String desc, String orderId) {
            super(state, desc);
            this.orderId = orderId;
        }

        public String getOrderId() {
            return orderId;
        }

        public void setOrderId(String orderId) {
            this.orderId = orderId;
        }

        public CreateOrderResult() {
        }
    }


    public static class OrderStatusResult {
        public int status;
        public String desc;


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

        public OrderStatusResult(int status, String desc) {
            this.status = status;
            this.desc = desc;
        }

        public OrderStatusResult() {
        }
    }

}
