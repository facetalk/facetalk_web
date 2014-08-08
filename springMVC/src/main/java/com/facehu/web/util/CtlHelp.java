package com.facehu.web.util;

import java.util.Date;

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
//        String check = "^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w+)+)$";
//        Pattern regex = Pattern.compile(check);
//        Matcher matcher = regex.matcher(email);
//        return matcher.matches();
        return true;
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

    public static class RegisterResult extends AjaxResult {
        public String userName;

        /**
         * @param state
         * @param desc
         * @param userName
         */
        public RegisterResult(resultState state, String desc, String userName) {
            super(state, desc);
            this.userName = userName;
        }

        public String getUserName() {
            return userName;
        }


        public void setUserName(String userName) {
            this.userName = userName;
        }

        public RegisterResult() {

        }
    }


    public static class CreateOrderResult extends AjaxResult {
        public String id;

        public CreateOrderResult(resultState state, String desc, String id) {
            super(state, desc);
            this.id = id;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
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


    public static class ChatRecordsResult {
        public static enum CallType {
            calling,
            called
        }


        private String partnerUserName;
        private String partnerName;
        private CallType callType;

        private String spendProductName;
        private int spendProductAmount;
        private Date beginTime;
        private Date finish_time;


        @Override
        public String toString() {
            final StringBuffer sb = new StringBuffer("ChatRecordsResult{");
            sb.append("partnerUserName='").append(partnerUserName).append('\'');
            sb.append(", partnerName='").append(partnerName).append('\'');
            sb.append(", callType=").append(callType);
            sb.append(", spendProductName='").append(spendProductName).append('\'');
            sb.append(", spendProductAmount=").append(spendProductAmount);
            sb.append(", beginTime=").append(beginTime);
            sb.append(", finish_time=").append(finish_time);
            sb.append('}');
            return sb.toString();
        }

        public String getPartnerUserName() {
            return partnerUserName;
        }

        public void setPartnerUserName(String partnerUserName) {
            this.partnerUserName = partnerUserName;
        }

        public String getPartnerName() {
            return partnerName;
        }

        public void setPartnerName(String partnerName) {
            this.partnerName = partnerName;
        }

        public CallType getCallType() {
            return callType;
        }

        public void setCallType(CallType callType) {
            this.callType = callType;
        }

        public String getSpendProductName() {
            return spendProductName;
        }

        public void setSpendProductName(String spendProductName) {
            this.spendProductName = spendProductName;
        }

        public int getSpendProductAmount() {
            return spendProductAmount;
        }

        public void setSpendProductAmount(int spendProductAmount) {
            this.spendProductAmount = spendProductAmount;
        }

        public Date getBeginTime() {
            return beginTime;
        }

        public void setBeginTime(Date beginTime) {
            this.beginTime = beginTime;
        }

        public Date getFinish_time() {
            return finish_time;
        }

        public void setFinish_time(Date finish_time) {
            this.finish_time = finish_time;
        }

        public ChatRecordsResult() {
        }

        public ChatRecordsResult(String partnerUserName, String partnerName, CallType callType, String spendProductName, int spendProductAmount, Date beginTime, Date finish_time) {
            this.partnerUserName = partnerUserName;
            this.partnerName = partnerName;
            this.callType = callType;
            this.spendProductName = spendProductName;
            this.spendProductAmount = spendProductAmount;
            this.beginTime = beginTime;
            this.finish_time = finish_time;
        }
    }

}
