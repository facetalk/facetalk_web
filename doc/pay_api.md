支付预提交
说明：将支付信息提交后台，获取订单号
接口：http://www.facehu.com/api/pay/createOrder
POST 参数
username 用户名
amount 购买数量
product 玫瑰是: rose
返回值
{"status":"success","desc":"成功","id":"xnidnsiwksysm"}
{"status":"failure","desc":"用户不存在","id":""}
提交支付
说明：将支付信息提交到淘宝，打开一个新页面
接口：http://www.facehu.com/api/pay/alipay
POST 参数
orderId 预支付的时候返回的订单ID
木有返回
支付状态查询
说明：查询订单状态，
接口：http://www.facehu.com/api/pay/orderStatus/{orderId}
get 方式
返回值
{"status":"0","desc":"未确认"}
{"status":"1","desc":"已提交支付"}
{"status":"2","desc":"支付成功"}
{"status":"3","desc":"支付失败"}
查询订单
说明：查询订单信息
接口：http://www.facehu.com/api/pay/getOrder/{orderId}
get方式
返回值

{"id":"5d98da164f8f4dd3938955478ce84ef0","username":"wd_gmail_com","productName":"rose","productDesc":"玫瑰","productAmount":1,"totalCost":100,"payStatus":0,"bank":null,"payWay":0,"orderDesc":"","creationTime":1406474754000,"modificationTime":1406354151000,"payStatusDesc":"未确认"}
 查询玫瑰数量
说明：查询玫瑰
接口：http://www.facehu.com/api/pay/getCount/rose/{username}
get方式
返回值

{"id":null,"username":"wd_gmail_com","productName":"rose","productAmount":3,"version":0,"creationTime":null,"modificationTime":null}

 聊天开始
说明：聊天开始时提交
接口：http://www.facehu.com/api/pay/chatrecord/begin/{callingUserName}/{calledUserName}
get
返回值（请记录id值，用于结束时提交）

{"status":"success","desc":"成功","id":"1"}
聊天结束
说明：如题
接口：http://www.facehu.com/api/pay/chatrecord/end/{id}
get
返回值

{"status":"success","desc":"成功"}
聊天记录分页查询
说明：查询聊天记录
接口：http://www.facehu.com/api/pay/getchatrecords/{userName}/{firstResult}/{maxResult}
get方式
userName 
firstResult 起始记录
maxResult 每页的最大记录数
返回值
callType 呼叫类型 called是被叫 calling是主叫
[{"partnerUserName":"wd_gmail_com","partnerName":"老李","callType":"called","spendProductName":null,"spendProductAmount":0,"beginTime":1406777133000,"finish_time":null},{"partnerUserName":"wd_gmail_com","partnerName":"老李","callType":"calling","spendProductName":null,"spendProductAmount":0,"beginTime":1406777216000,"finish_time":1406777241000}]
扣费接口
说明