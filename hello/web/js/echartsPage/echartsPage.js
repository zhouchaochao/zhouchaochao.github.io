/**
 * created by chaochao on 17-05-07
 */
$(function () {

    initTime();//初始化时间

    //折线图
    initMultiLineEChartWithToolboxAndClickEvent('readNet_div', [1,7], [[1,2],[3,4],[5,6]], ["a","b","c"]);

    initEchartBar();//柱状图

    $("#searchButton").click(function(){
        console.log(new Date($("#beginTime").val()).Format("yyyy-MM-dd hh:mm:ss.S"));
         console.log(new Date($("#endTime").val()).Format("yyyy-MM-dd hh:mm:ss.S"));
         console.log($("#clusterSelect").val());
         console.log($("#ipSelect").val());
         console.log($("#nodeSelect").val());

        alert($("#clusterSelect").val());
    });


    $("#changeEchartDataButton").click(function(){

        console.log($("#legends_echartData").val());
        console.log($("#x_echartData").val());
        console.log($("#y_echartData").val());

        var legends_echartData_str = '['+$("#legends_echartData").val()+']';
        var legends_echartData_obj = JSON.parse(legends_echartData_str);

        var x_echartData_str = '['+$("#x_echartData").val()+']';
        var x_echartData_obj = JSON.parse(x_echartData_str);

        var y_echartData_str = '['+$("#y_echartData").val()+']';
        var y_echartData_obj = JSON.parse(y_echartData_str);

        initMultiLineEChartWithToolboxAndClickEvent('readNet_div',x_echartData_obj,y_echartData_obj,legends_echartData_obj);
    });
});



/**
 * 支持多条折线图,包含自定义工具箱用于显示所有，鼠标点击事件处理
 * @param id   vm中用于图表展示的div的ID
 * @param x_datas x轴数据  例如：[1,2,3]
 * @param y_datas y轴数据  例如：[[1,2,3],[4,5,6]]
 * @param legends 每个y轴数据的说明 例如：['jiesi-1','jiesi-2']
 * @returns {echarts}
 */
function initMultiLineEChartWithToolboxAndClickEvent(id, x_datas, y_datas, legends) {
    var chart = echarts.init(document.getElementById(id));
    var series = [];
    for (var i = 0; i < y_datas.length; i++) {
        var a = {
            name: legends[i],
            type: 'line',
            data: y_datas[i]
        };
        series.push(a);
    }

    var option = {
        legend: {
            data: legends
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            data: x_datas
        },
        grid: {
            show: false,
            left: 60,
            top: 30,
            right: '1%'
        },
        yAxis: {type: 'value'},
        series: series,
        toolbox: {
            show: true,
            feature: {
                //dataView: {},//数据视图
                //restore: {},//还原
                //saveAsImage: {},//保存为图片
                myTool1: {//自定义工具只能以my开头
                    show: true,
                    title: '切换显示',
                    //icon: "image://dist/img/favicon.png",
                    //icon: 'image://http://echarts.baidu.com/images/favicon.png',
                    icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                    onclick: function (){
                        var hasShowLine = false;//目前的图表中是否有显示图像
                        if(jQuery.isEmptyObject(chart.getOption().legend[0].selected)){//如果为空，那说明初始化图表时默认显示所有折线图
                            hasShowLine = true;
                        }
                        for(key in chart.getOption().legend[0].selected){
                            if(chart.getOption().legend[0].selected[key]){
                                hasShowLine = true;
                            }
                        }

                        var showAll = hasShowLine ? false : true;//是否显示所有数据线
                        var selected_str = '{';
                        for (var i = 0; i < legends.length; i++) {
                            if (selected_str != '{') {
                                selected_str += ','
                            }
                            selected_str += '"' + legends[i] + '"' + ':' + showAll;
                        }
                        selected_str += '}';
                        var selected_option = {"legend": {"selected": {}}};
                        selected_option.legend.selected = JSON.parse(selected_str);
                        chart.setOption(selected_option);
                    }
                }
            }
        },
    };

    //单击事件，不显示
    chart.on('click', function (params) {
        var selected_str = '{';
        selected_str += '"' + params.seriesName + '"' + ':' + false;//不显示
        selected_str += '}';
        var selected_option = {"legend": {"selected": {}}};
        selected_option.legend.selected = JSON.parse(selected_str);
        chart.setOption(selected_option);
    });

    //双击事件
    //因为有单击事件处理函数，所以双击不会被处理
    chart.on('dblclick', function (params) {
        console.log(jQuery.isEmptyObject(chart.getOption().legend[0].selected));
        var selected_str = '{';
        for (var i = 0; i < legends.length; i++) {
            if (selected_str != '{') {
                selected_str += ','
            }
            selected_str += '"' + legends[i] + '"' + ':' + ((legends[i]== params.seriesName)?true:false);//只显示选中的
        }
        selected_str += '}';
        var selected_option = {"legend": {"selected": {}}};
        selected_option.legend.selected = JSON.parse(selected_str);
        chart.setOption(selected_option);
    });

    chart.setOption(option);
    return chart;
}


function initTime() {

    var beginTime = {
        elem: '#beginTime',
        festival: true,
        max: laydate.now(),
        istime: true,
        format: 'YYYY-MM-DD hh:mm:ss'
    };
    laydate(beginTime);

    var endTime = {
        elem: '#endTime',
        festival: true,
        max: laydate.now(),
        istime: true,
        format: 'YYYY-MM-DD hh:mm:ss'
    };
    laydate(endTime);

    //如果开始时间和结束时间都没有设置，那么设置一个默认值
    if (($("#beginTime").val() == null || $("#beginTime").val() == '') && ($("#endTime").val() == null || $("#endTime").val() == '')) {

        var now = new Date();
        var beginTime = new Date(now.getTime() - 1000 * 60 * 60 * 1);
        var beginTimeStr = beginTime.Format("yyyy-MM-dd hh:mm:ss");
        var endTimeStr = now.Format("yyyy-MM-dd hh:mm:ss");

        $("#beginTime").val(beginTimeStr);
        $("#endTime").val(endTimeStr);
        //$("#beginTime").val('2017-05-07 11:11:11');
        //$("#endTime").val('2017-05-07 12:12:12');
    }
}

/**
 * 柱状图bar
 */
function initEchartBar() {

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('zhu_zhuang_tu_id'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}