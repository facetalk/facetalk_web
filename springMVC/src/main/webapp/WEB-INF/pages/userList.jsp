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
        <tr valign="top">
            <td valign="top">
                <a href="/api/admin/loginLog/0/1000">全部登陆日志 >>> </a><br/>
                <a href="/api/admin/chatRecords/0/1000">全部聊天记录 >>> </a>


            </td>
            <td>
                <div align="center">

                    全部注册用户

                    <table border="1">
                        <c:forEach var="user" items="${users}" varStatus="status">
                            <tr>
                                <td>${status.index+1}</td>
                                <td><a href="/api/admin/loginLogByUser/${user.username}"> ${user.username} </a></td>
                                <td>${user.name}</td>
                                <td>${user.creationTime}</td>
                                <td><a href="http://www.ip138.com/ips138.asp?ip=${user.ip}"
                                       target="_blank"> ${user.ip} </a>
                                </td>

                                <td>
                                    <c:if test="${user.infoCompleteness==1}">
                                        <a target="_blank" href="http://www.facehu.com/#/tab/detail/${user.username}">
                                            <img
                                                    src="/avatar/${user.username}.100.png" alt=""> </a>
                                        </br>

                                        <a href="/api/admin/deletePic/${user.username}/3" target="_blank">
                                            【头像不清晰删除】
                                        </a></br>
                                        <a href="/api/admin/deletePic/${user.username}/4" target="_blank">
                                            【头像不完整删除】
                                        </a></br>
                                        <a href="/api/admin/deletePic/${user.username}/5" target="_blank">
                                            【非本人头像删除】
                                        </a></br>
                                        <a href="/api/admin/deletePic/${user.username}/6" target="_blank">
                                            【头像不雅删除】
                                        </a>
                                    </c:if>


                                    <c:if test="${user.infoCompleteness==2}">
                                        被删除
                                    </c:if>
                                    <c:if test="${user.infoCompleteness==3}">
                                        3头像不清晰删除
                                    </c:if>
                                    <c:if test="${user.infoCompleteness==4}">
                                        4头像不完整删除
                                    </c:if>
                                    <c:if test="${user.infoCompleteness==5}">
                                        5非本人头像删除
                                    </c:if>
                                    <c:if test="${user.infoCompleteness==6}">
                                        6头像不雅删除
                                    </c:if>

                                    <c:if test="${user.infoCompleteness==0}">
                                        未上传
                                    </c:if>
                                </td>

                                <td>

                                    <c:if test="${user.gender==0}">
                                        女性</br>
                                        <a href="/api/admin/setGender/${user.username}/1" target="_blank">
                                            【设置成男性】 </a>
                                    </c:if>
                                    <c:if test="${user.gender==1}">
                                        男性</br>
                                        <a href="/api/admin/setGender/${user.username}/0" target="_blank">
                                            【设置成女性】 </a>
                                    </c:if>


                                </td>
                                <td>

                                    <c:if test="${user.status==0}">
                                        用户被删除</br>
                                        <a href="/api/admin/recoverUser/${user.username}" target="_blank">
                                            【恢复】 </a>
                                    </c:if>
                                    <c:if test="${user.status==1}">
                                        正常</br>
                                        <a href="/api/admin/deleteUser/${user.username}" target="_blank">
                                            【删除用户】 </a>
                                    </c:if>


                                </td>

                            </tr>
                        </c:forEach>
                    </table>
                </div>
            </td>
        </tr>
    </table>

</div>
</body>
</html>