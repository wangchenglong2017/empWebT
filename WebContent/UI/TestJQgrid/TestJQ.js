
//初始化参数设定
var fitColumns = false;//true 自适应列宽  false 固定列宽  根据用户自己设定列如实加载
var pagination = true;//true 是否需要分页
var nowrap = false;//是否智能隐藏   true：数据量过大时会以省略号代替  false:数据量过大，直接换行
var pagesize = 15;
var rownumbers = true;//是否需要行号
var singleSelect = false;//列表行 是否单选 true:只能单选

var listurl = "";//页面列表数据获取地址
var idField = "";//列表主键
var action = "getlist";


var jq_list_columns = "";
var coljsonstr = "";//临时存储列Json变量  保持页面json最新

function ListQueryDataGrid(objj, datastr, creator, width, height) {
    $.ajax({
        type: "POST",
        url: "/UI/AjaxPage/GridManager.ashx",
        data: "Action=CheckSet&menucode=" + menucode + "&creator=" + creator,
        async: false,
        beforeSend: function () {
        },
        success: function (columnList) {
            if (columnList != 'false') {
                coljsonstr = columnList;
                jq_list_columns = "[" + columnList + "]";
            }
        }
    });
    var columns = eval('(' + jq_list_columns + ')');//获取列名
    listurl = listurl + "?Action=" + action;
    objj.datagrid({
        url: listurl,
        method: 'post',
        queryParams: datastr,
        idField: idField,                          //跨分页选择数据
        fitColumns: fitColumns,
        singleSelect: singleSelect,
        rownumbers: rownumbers,
        pagination: pagination,
        nowrap: nowrap,
        width: width,
        height: height,
        pageSize: pagesize,
        loadMsg: '数据装载中…',
        pageList: [15, 30, 50, 100, 200],
        columns: columns,
        onLoadSuccess: function (data) {//设置行之间是实线
           // console.log(data);
            var panel = $(this).datagrid('getPanel');
            var tr = panel.find('div.datagrid-body tr');
            var tr1 = panel.find('div.datagrid-header tr');
            tr.each(function () {
                $(this).children('td').css({ "border-style": "solid" });
            });
            tr1.each(function () {
                $(this).children('td').css({ "border-style": "solid" });
            });
        },
        onResizeColumn: function (field, width) {//拖拽列名 自定义列宽
            var colNames = new Array();
            var arrayold = coljsonstr.replace(/\[/g, "").replace(/\]/g, "").replace(/\},{/g, "}@{").split('@');

            $.each(arrayold, function (i, item) {
                if (item.indexOf(field) > 0 && item.indexOf('.' + field) < 0) {//防止自定义函数中，传的参数中带有字段（列）名
                    var before = item.substring(0, item.indexOf("width:") + "width:".length);
                    var after = item.substring(item.indexOf(",align"), item.length);
                    colNames[i] = before + width + after;
                } else {
                    colNames[i] = item;
                }
            });
            var newJsonstring = "[";
            $.each(colNames, function (i, item) {
                newJsonstring = newJsonstring + item + ",";
            });
            newJsonstring = newJsonstring.substring(0, newJsonstring.length - 1) + "]";

            $.ajax({
                type: "POST",
                url: "/UI/AjaxPage/GridManager.ashx",
                data: "Action=SaveWidth&menucode=" + menucode + "&creator=" + creator + "&newJsonstring=" + newJsonstring,
                async: false,
                beforeSend: function () {
                },
                success: function (returnResult) {
                    if (returnResult != null) { //保存宽度成功  前台无需给提示  变量赋值最新列Json
                        coljsonstr = newJsonstring;
                    }
                }
            });
        }
    });
    objj.datagrid('getPager').pagination({
        beforePageText: '第',//页数文本框前显示的汉字   
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
    });
}

function getPageSize() {
    var winW, winH;
    if (window.innerHeight) {// all except IE 
        winW = window.innerWidth;
        winH = window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {// IE 6 Strict Mode 
        winW = document.documentElement.clientWidth;
        winH = document.documentElement.clientHeight;
    } else if (document.body) { // other 
        winW = document.body.clientWidth;
        winH = document.body.clientHeight;
    }
    console.log({ WinW: winW, WinH: winH });
    return { WinW: winW, WinH: winH };
}



function dozdy(gourl) {
    var url = gourl; //转向网页的地址; 
    var name = '自定义列名维护';//网页名称，可为空; 
    var iWidth = 610;//弹出窗口的宽度; 
    var iHeight = 350;//弹出窗口的高度; 
    //获得窗口的垂直位置 
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
    //获得窗口的水平位置 
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
    window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no');
}




//序列化时间后反序列化
function renderTime(data, IsOnlyDate) {
    if (data == null || data == "" || data == "undefined")
        return null;
    var da = eval('new ' + data.replace('/', '', 'g').replace('/', '', 'g'));
    var y = da.getFullYear();
    var mon = da.getMonth() + 1;
    var day = da.getDate();
    var h = da.getHours();
    var m = da.getMinutes();
    var s = da.getSeconds();
    if (mon < 10) { mon = "0" + mon; }
    if (day < 10) { day = "0" + day; }
    if (h < 10) { h = "0" + h; }
    if (m < 10) { m = "0" + m; }
    if (s < 10) { s = "0" + s; }

    if (IsOnlyDate)
        return y + "-" + mon + "-" + day;
    else
        return y + "-" + mon + "-" + day + " " + h + ":" + m + ":" + s;
}
