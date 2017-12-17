//查询事件（地址，参数，排序字段，排序方式，主键字段，列内容）
var jq_autocheck = true;
var jq_list_handleurl = "";
var jq_list_sortname = "";
var jq_list_softorder = "";
var jq_list_idfield = "";
var jq_list_columns = "";
var jq_lst_action = "getlist";
var jq_pagesize = 15;
var menucode = "";

var coljsonstr = "";//临时存储列Json

function ListQueryJQ() {
    var creator = GetCookie("EmplyeeUserName");
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
                jq_list_columns = columnList;
            }
        }
    });
    var listparam = "";
    listparam = getParam(jq_lst_action);

    //根据获取的col拼接列名colNames
    var columns = eval('(' + jq_list_columns + ')');
    var colNames = new Array();
    var list_col = jq_list_columns.split("},{");
    $.each(list_col, function (i, item) {
        var checkitem = item.replace(" ", "").replace("[{", "");
        var reg = checkitem.match(/title:'(\S*)',name/)[1];
        colNames[i] = reg;
    });

    var url = jq_list_handleurl;
    if (listparam != "")
        url += listparam;
    //创建jqGrid组件
    var postData = { Action: "GetList" };
    var changecol = "";//变量，记录用户拖动列的列名
    jQuery("#JqGridList").jqGrid(
    {
        url: url, //请求数据的url
        datatype: 'json',  //请求数据返回的类型。可选json,xml,txt
        postData: postData,
        async: false,
        colModel: columns,
        colNames: colNames,
        multiselect: jq_autocheck,
        rowNum: jq_pagesize, //一页显示多少条
        rowList: [15, 30, 50, 100], //可供用户选择一页显示多少条
        pager: '#JqGridPage', //表格页脚的占位符(一般是div)的id
        sortname: jq_list_sortname, //初始化的时候排序的字段
        sortorder: jq_list_softorder, //排序方式,可选desc,asc
        mtype: "post", //向后台请求数据的ajax的类型。可选post,get
        viewrecords: true,
        autowidth: true,
        shrinkToFit: false,
        jsonReader: {
            repeatitems: false

        },
        //caption: "样表-测试用Demo",//表格的标题名字
        resizeStart: function (event, name) { //拖动列名时，记录当前拖动的列
            changecol = event.currentTarget.id;
        },
        resizeStop: function (width, index) { //拖动列名后，记录当前拖动的列名称和新的列宽
            var columncode = changecol.substring(changecol.indexOf('_') + 1, changecol.length);
            var colNames = new Array();
            var arrayold = coljsonstr.replace(/\[/g, "").replace(/\]/g, "").replace(/\},{/g, "}@{").split('@');

            $.each(arrayold, function (i, item) {
                if (item.indexOf(columncode) > 0) {
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

        },
        loadComplete: function () {
            var reRecords = $("#JqGridList").getGridParam('records');
            if (reRecords == 0 || reRecords == null) {
                if ($(".norecords").html() == null) {
                    $("#JqGridList").parent().append("<div class=\"norecords\">暂无符合条件的数据！</div>");
                    $(".norecords").show();
                }
            } else {
                $(".norecords").hide();
            }
        }
    });
    /*创建jqGrid的操作按钮容器*/
    /*可以控制界面上增删改查的按钮是否显示*/
    jQuery("#JqGridList").jqGrid('navGrid', '#JqGridPage', { edit: false, add: false, del: false, search: false, refresh: false });
    doResize();
}

function doResize() {
    var ss = getPageSize();
    $("#JqGridList").jqGrid('setGridWidth', ss.WinW - 45).jqGrid('setGridHeight', ss.WinH - 200);
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
    return { WinW: winW, WinH: winH };
}



//▼▼▼页面自定义方法
function dozdy() {
    var Title = "自定义显示列";
    parent.$('#openFrameDiv').dialog({
        title: Title,
        width: 610,
        height: 370,
        closed: true,
        cache: false,
        modal: true,
        resizable: true,
        onClose: function () {
            refresh();
        },
        buttons: null
    });
    parent.$('#openIframe')[0].src = encodeURI(encodeURI("/UI/JqGridZDY.aspx?menucode=" + menucode + "&coljsonstr=" + coljsonstr));
    parent.$('#openFrameDiv').dialog('open');
    return false;
}
//刷新页面
function refresh() {
    window.location = window.location;
}
//▲▲▲▲▲▲


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
