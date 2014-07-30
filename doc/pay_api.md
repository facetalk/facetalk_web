支付相关接口

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
id 预支付的时候返回的订单ID
木有返回
支付状态查询
说明：查询订单状态，
接口：http://www.facehu.com/api/pay/orderStatus/{id}
get 方式
返回值
{"status":"0","desc":"未确认"}
{"status":"1","desc":"未支付"}
{"status":"2","desc":"支付成功"}
{"status":"3","desc":"支付失败"}
 查询玫瑰数量
说明：查询玫瑰
接口：http://www.facehu.com/api/pay/getCount/rose/{username}
get方式
返回值
{"username":"admin","product":"rose","count":"1"}
消费玫瑰
说明：消费玫瑰
接口：http://www.facehu.com/api/pay/consume
POST 参数
username 用户名
amount 消费数量
product 玫瑰是: rose
返回值
{"status":"success","desc":"成功"}
{"status":"failure","desc":"余额不足"}
订单查询
说明：查询用户支付过的订单
接口：http://www.facehu.com/api/pay/orderlist/{username}
get
放回值
