<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <%
        String contextPath = request.getContextPath();
    %>
<head>
    <title>登录用户统计</title>
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/resources/easyUI/themes/gray/easyui.css">
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/resources/easyUI/icon.css">
    <link rel="stylesheet" type="text/css" href="<%=contextPath%>/resources/easyUI/demo.css">
    <script type="text/javascript" src="<%=contextPath%>/resources/js/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="<%=contextPath%>/resources/easyUI/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="<%=contextPath%>/resources/js/highcharts.js"></script>
</head>
<body>
<div>
    <div id="chartpanel" class="easyui-panel" title=" " style="width:'100%';height:auto;padding:10px;">
        <div id="chart" style="hight:300px; min-width: 400px; height: auto; margin: 0 auto"></div>
    </div>
    <div id="tablepanel" class="easyui-panel" title=" "
         style="width:'100%';height:auto;padding:10px;padding-right: 25px;">
        <table id="tt" class="easyui-datagrid" class="easyui-datagrid" style="width:auto;height:auto;" rownumbers="true"
               toolbar="#tool">
        </table>
    </div>
</div>
<script>
    function commafy(num){

        if(isNaN(num)){
            return"";
        }
        num = num+"";
        var xiaoshu="";
        if(num.indexOf(".")!=-1) {
            num=num.substring(0,num.indexOf("."));
            xiaoshu=num.substring(num.indexOf("."),num.length);
        }

        if(/^.*\..*$/.test(num)){
            var intPart = intPart +"";
            var re =/(-?\d+)(\d{3})/
            while(re.test(intPart)){
                intPart =intPart.replace(re,"$1,$2")
            }
            num = intPart+"."+pointPart;
        }else{
            num = num +"";
            var re =/(-?\d+)(\d{3})/
            while(re.test(num)){
                num =num.replace(re,"$1,$2")
            }
        }
        return num+xiaoshu;
    }

   var columns = [[
        {field: 'idate', width:100, title: '时间'},
        {field: 'loginUserNum', title: '登陆用户数', width:100,formatter: function (value, row, index) {
            return commafy(value + "");
        }},
        {field: 'loginNum', title: '登陆次数', width:100, formatter: function (value, row, index) {
            return commafy(value + "");
        }}
    ]];

    $(function () {
        var data = '${stats}';
        data = eval('(' + data + ')');
        $('#tt').datagrid({
            width: 'auto',
            height: 'auto',
            fitColumns: true,
            columns: columns,
            data: data
        });
        data = data.reverse();
        var categories = [];
        var series = [];
        var loginUserNum = [];
        var loginNum = [];
        var xAxisStep = Math.ceil(parseFloat(data.length) / 10);
        //data = data.reverse();
        for (var i = 0; i < data.length; i++) {
            categories.push(data[i]['idate']);
            loginUserNum.push(data[i]['loginUserNum']);
            loginNum.push(data[i]['loginNum']);
        }
        series.push({name: '登录用户数', data: loginUserNum});
        series.push({name: '登录次数', data: loginNum});

        $("#chartpanel").panel({title: "日期趋势图"});
        try {
            drawChart(categories, series, xAxisStep);
        } catch (err) {
        }

    });

    function drawChart(categories, series, xAxisStep) {
        $('#chart').highcharts({
            chart: {
                type: 'spline'
            },
            credits: {enabled: false},
            title: {
                // text: '移动用户趋势图'
                text: ''
            },
            xAxis: {
                categories: categories,
                labels: {
                    step: xAxisStep,
                    formatter: function() {
                        var time = this.value + "";
                        var result;
                        if (time.length < 6) {
                            result = getNextTime();
                        } else {
                            result = time.substring(0, 4) + "-" + time.substring(4,6);
                            if (time.length > 6) {
                                result += "-" + time.substring(6, 8);
                            }
                        }
                        return result;
                    }
                }
            },
            yAxis: {

                min: 0,
                title: {
                    text: ''
                },
                labels: {
                    formatter: function () {//设置纵坐标值的样式
                        return commafy(this.value + '');
                    }
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            tooltip: {
                formatter: function () {
                    var time = this.x + "";
                    var t;
                    if (time.length < 6) {
                        t = getNextTime();
                    } else {
                        t = time.substring(0, 4) + "-" + time.substring(4,6);
                        if (time.length > 6) {
                            t += "-" + time.substring(6, 8);
                        }
                    }

                    return '<b>' + t + '</b><br/>' +
                            this.series.name + ': ' + commafy(this.y + '');
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top',
                borderWidth: 0
            },
            plotOptions: {
                series: {
                    events: {
                        hide: function(event) {
                            if (this.name == "VV") {
                                var series = $('#chart').highcharts().series;
                                series[this.index - 1].setVisible(false);
                            }
                        },
                        show: function(event) {
                            if (this.name == "VV") {
                                var series = $('#chart').highcharts().series;
                                series[this.index - 1].setVisible(true);
                            }
                        }
                    }
                }
            },
            series: series
        });
    }
</script>
</body>
</html>