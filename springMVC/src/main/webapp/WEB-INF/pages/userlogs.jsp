<%@page contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>用户登陆日志</title>
</head>
<body>
<div align="center">
    <table border="1">
        ${log.name}登陆日志
        <c:forEach var="log" items="${userlogs}" varStatus="status">
            <tr>
                <td>${status.index+1}</td>
                <td>${log.username}</td>
                <td>${log.name}</td>
                <td><a href="http://www.ip138.com/ips138.asp?ip=${log.ip}" target="_blank"> ${log.ip} </a>
                </td>
                <td>${log.loginTime}</td>
                <td>
                    <c:if test="${log.infoCompleteness==1}">
                        <a target="_blank" href="http://www.facehu.com/#/tab/detail/${log.username}"><img
                                src="/avatar/${log.username}.100.png" alt=""> </a>
                    </c:if>
                </td>
            </tr>
        </c:forEach>
    </table>
</div>
</body>
</html>