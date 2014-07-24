
用户相关接口
======


   
   *	基本信息注册 
   
		http://www.facehu.com/api/user/register 
		POST 参数
				* email 邮箱
				* password 密码
				* name 昵称
 		返回
   				* {"status":"success","desc":"基本信息注册成功"}
				* {"status":"failure","desc":"邮箱验证错误”}


* 保存头像

		http://www.facehu.com/api/user/savePic 
		POST参数
      			* picData Base64的图片字符串
				* username 用户名
		返回
      			* {"status":"success","desc":"成功"}
				* {"status":"failure","desc":"失败”}
   		头像路径约定
      			http://www.facehu.com/avatar/{username}.png


   * 登陆后端

			说明，一次全新的登陆，应该是先登陆后端，然后再登陆XMPP。登陆后端后会种登陆cookie，有效期两周，在登陆cookie有效期内，后续登陆只需要登陆XMPP（自动登陆）。其中登陆cookie有三个，包括 _fh_username (用户名)；_fh_authsession（会话，每次登陆都全新生成）；_fh_autho（认证，不修改密码值不变），前端从_fh_username这里取用户名
			http://www.facehu.com/login 登陆提交地址
			POST
				loginUserName
				loginPassword
			返回
      			* {"status":"success","desc":"成功”}
				* {"status":"failure","desc":"失败”}


   * 登陆XMPP (获得 RID SID)
   
	 http://www.facehu.com/api/user/loginForXmpp/{loginUserName}
	 
   	 GET
   * 返回
      * 如果登陆cookie已经失效，则直接返回 403，引导用户重新登陆后端。任何后端请求，只要返回403，都需要用户重新登陆
      * 如果登陆cookie有效，返回 {"jid":"admin@facetalk/80","sid":"3a8b74894326f85a5dddf1aaebd7106544b5940c","rid":"4857571”}



   * 获取用户信息
	 http://www.facehu.com/api/user/get/{username}
      * GET
	* 返回
		{"username":"admin","password":"admin222","name":"admin","email":"admin@sss","gender":1,"sexualOrientation":0,"introduction":null,"infoCompleteness":0,"creationTime":1405752846000,"modificationTime":1405758989000}
    * 取不到则没有返回

* 获取在线用户列表
      * http://www.facehu.com/xmpp/get/allonline
     * GET
    * 返回
			返回用逗号分隔的用户jid；如果没有在线用户，返回null


   * 获取用户状态 （支持的状态：offline available away chat dnd xa）
http://www.facehu.com/xmpp/user/status/admin@facetalk/xml
        
            * GET
            * 返回
            * 用户不存在
               * <presence type="error" from="admin22@facetalk"><error code="403" type="auth"><forbidden xmlns="urn:ietf:params:xml:ns:xmpp-stanzas"/></error></presence>
            * 用户不在线
               * <presence type="unavailable" from="admin@facetalk"><status>Unavailable</status></presence>
				* 用户在线
				* <presence from="user8@my.openfire.com/trm"><priority>0</priority></presence>
				* 或者
				* <presence id="6Mgiu-13" from="user8@my.openfire.com/Smack"/>
