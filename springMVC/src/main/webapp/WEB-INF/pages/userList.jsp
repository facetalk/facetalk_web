<%@page contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>用户墙</title>
</head>
<body>
<div align="center">
    <table border="0">
        <c:forEach var="user" items="${users}" varStatus="status">
            <tr>
                <td>${status.index+1}</td>
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.creationTime}</td>
                <td>
                    <c:if test="${user.infoCompleteness==1}">
                        <img src="/avatar/${user.username}.100.png" alt="">
                    </c:if>
                </td>
            </tr>
        </c:forEach>
    </table>
</div>
</body>
</html>