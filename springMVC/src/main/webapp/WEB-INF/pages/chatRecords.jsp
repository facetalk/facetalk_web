<%@page contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>全部聊天记录</title>
</head>
<body>


<table border="0">
    <tr>
        <td>
            <a href="/api/admin/userWall">用户墙</a> <br/>
            <a href="/api/admin/loginLog/0/1000">全部登陆日志 </a><br/>


        </td>
        <td>
            <div align="center">

                全部聊天记录

                <table border="1">
                    <c:forEach var="chatRecord" items="${chatRecords}" varStatus="status">
                        <tr>
                            <td>${status.index+1}</td>
                            <td>主叫
                                <a href="/api/admin/loginLogByUser/${chatRecord.callingUserName}">
                                    <img src="/avatar/${chatRecord.callingUserName}.100.png">
                                </a>
                            </td>
                            <td>被叫
                                <a href="/api/admin/loginLogByUser/${chatRecord.calledUserName}">
                                    <img src="/avatar/${chatRecord.calledUserName}.100.png">
                                </a>
                            </td>
                            <td>
                                    ${chatRecord.beginTime}
                            </td>
                            <td>
                                    ${chatRecord.finish_time}
                            </td>
                        </tr>
                    </c:forEach>
                </table>
            </div>
        </td>
    </tr>
</table>

</body>
</html>