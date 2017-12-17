<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="JqGridList.aspx.cs" Inherits="HH.Employee.WebUI.UI.JqGridList" %>


<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>JqGrid测试</title>
    <link href="/Scripts/EasyUi/themes/default/easyui.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/EasyUi/themes/default/style.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/UI/pager/pagination.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/table/tablediscolor.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/lhgcalendar/skins/lhgcalendar.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/EasyUi/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="/Scripts/UI/pager/jquery.pagination.js" type="text/javascript"></script>
    <script src="/Scripts/lhgcalendar/lhgcalendar.min.js" type="text/javascript"></script>
    <script src="/Scripts/table/tablediscolor.js" type="text/javascript"></script>
    <script src="/Scripts/Common.js" type="text/javascript"></script>
    <script src="/Scripts/UI/pageComm.js"></script>


    <!--列表页必要引用--->
    <script type="text/javascript" src="/Scripts/jquery-1.7.1.js"></script>
    <script src="/UI/TestJQgrid/HH_List.js"></script>
    <!--jqgrid必要引用--->
    <link href="/Scripts/jqgridlist/themes/cupertino/jquery-ui.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/jqgridlist/css/ui.jqgrid.css" rel="stylesheet" type="text/css" />
    <script src="/Scripts/jqgridlist/js/grid.locale-cn.js" type="text/javascript"></script>
    <script src="/Scripts/jqgridlist/js/jquery.jqGrid.src.js" type="text/javascript"></script>
    <script type="text/javascript">

        //▼▼▼页面基础参数以及初始化
        //查询事件（地址，参数，排序字段，排序方式，主键字段，列内容）
        var jq_autocheck = true;
        jq_list_handleurl = "/UI/AjaxPage/GridManager.ashx";
        var jq_list_sortname = "";//初始化的时候排序的字段
        var jq_list_softorder = "";//初始化的时候排序类型
        var jq_list_idfield = "CN_GUID";//列表主键
        var jq_lst_action = "GetList";
        var pagesize = 15;
        window.onload = function () {
            menucode = GetQueryString("menuid");//页面基本参数二：菜单id
            pageInit();
            AjaxStop();
        };
        function AjaxStop() {
            parent.$("#divLoading").hide();
        }
        function pageInit() {
            ListQueryJQ();
        }
        //▲▲▲▲▲▲

        //▼▼▼页面查询按钮，主要用来刷新Jqgrid
        function query() {
            var listparam = "";
            var url = jq_list_handleurl;
            listparam = getParam(jq_lst_action);
            if (listparam != "")
                url += "&" + listparam;

            $("#JqGridList").jqGrid('setGridParam', {
                datatype: "json",
                url: url,
                page: 1
            }).trigger("reloadGrid"); //重新载入 
        }
        //▲▲▲▲▲▲

        //▼▼▼获取页面参数
        function getParam(action) {
            var querypar = "?Action=" + action;
            var par = "";
            try {
                par = getParam_Query(); //页面特殊参数处理
            } catch (e) {
                par = '';
            }
            if (par != '') {
                querypar += par;
            }
            return querypar;
        }
        //查询条件特殊参数处理（无特殊处理此方法可以返回空，参数必须加上&）  return "&name=a";
        function getParam_Query() {
            var username = $("#txt_username").val();
            var sex = $("#txt_sex").val();
            return "&username=" + username + "&sex=" + sex;
        }
        //▲▲▲▲▲▲



        //这个方法是写在ColumnBase类中，测试列格式化用的
        function GetTest(id) {
            return "<a href=\"#\" class=\"alink\" onclick=\"View2('" + id + "');return false;\"><span style=\"color:#15428B\">主键</span></a>";
        }
        function View2(id) {
            alert("你想操作的数据主键是：" + id);
        }

        //新增
        function Add() {
            var Title = "应用编辑";
            //显示进度条 
            parent.$("#divLoading").show();
            parent.$('#openFrameDiv').dialog({
                title: Title,
                width: 500,
                height: 316,
                closed: true,
                cache: false,
                modal: true,
                maximizable: true,
                resizable: true,
                onClose: function () {
                    parent.$('#openIframe')[0].src = "none.html";
                },
                buttons: null
            });
            parent.$('#openIframe')[0].src = "/UI/AppEdit.aspx";
            parent.$('#openFrameDiv').dialog('open');
        }
        //修改
        function Update() {

            getSelect();
            return false;
            var Title = "应用编辑";

            var guid = "", name = "", note = "";
            $("#tbList>tbody>tr").each(function () {
                if ($(this).find("input[name='chkid']").attr("checked") == true) {
                    guid += $(this).find("input[name='chkid']").val();
                    name = $(this).find("td[colname='name']").text();
                    note = $(this).find("td[colname='note']").text();
                }
            })
            if (guid.length > 8 || guid.length == 0) {
                //alert("必须或只能选择一行数据");
                parent.ShowMsg("必须或只能选择一行数据!");
                return;
            }
            else {
                //显示进度条 
                parent.$("#divLoading").show();
                parent.$('#openFrameDiv').dialog({
                    title: Title,
                    width: 500,
                    height: 316,
                    closed: true,
                    cache: false,
                    modal: true,
                    maximizable: true,
                    resizable: true,
                    onClose: function () {
                        parent.$('#openIframe')[0].src = "none.html";
                    },
                    buttons: null
                });
                parent.$('#openIframe')[0].src = "/UI/AppEdit.aspx?Action=Update&note=" + note + "&chkid=" + guid + "&name=" + name;
                parent.$('#openFrameDiv').dialog('open');
            }
        }
        //删除
        function deleteBtn() {
            getSelect();
            return false;
            var values = "";
            $("#tbList>tbody>tr").each(function () {
                if ($(this).find("input[name='chkid']").attr("checked") == true) {
                    //获得任务单号
                    values += $(this).find("input[name='chkid']").val() + ",";
                }
            })
            if (values == "") {
                parent.ShowMsg("最少选择一行！");
                return false;
            }
            deletes(values);

        }

        function deletes(values) {

            parent.$.messager.confirm('系统提示', '确认删除吗？', function (r) {
                if (r) {
                    var ajaxUrl = webapi + "/api/App/Delete";
                    var ajaxData = { values: values };
                    var msgs = AjaxManagers_json(ajaxData, ajaxUrl);
                    if (msgs == "true" || msgs == true) {
                        parent.ShowMsg("删除成功！");
                        SetPage();
                    }
                    else {
                        parent.ShowMsg("删除失败");
                    }
                }
            });
        }


        //获取选中行
        function getSelect() {
            var ids = [];
            var rows = $("#JqGridList").jqGrid('getGridParam', 'selarrrow');
            for (var i = 0; i < rows.length; i++) {
                var ix = rows[i];
                var rowDatda = $("#JqGridList").getRowData(ix);
                ids.push(eval("rowDatda." + jq_list_idfield));
            }
            parent.ShowMsg("你选中的数据是：" + ids);
        }



    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
        <div id="loading">
        </div>
        <table style="min-width: 882px; min-height: 500px" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td valign="top" bgcolor="#e6e6e8" class="main">
                    <div class="searchShow">
                        <div>
                            <span class="title">用户名称:</span>
                            <div style="width: 110px; padding: 0; margin: 0;">
                                <input type="text" id="txt_username" onkeyup="replaceSpecialSymbol(this)" class="inputText wf100" style="width: 100px;" />
                            </div>
                        </div>

                        <div style="text-align: Left">
                            <span class="title">性别:</span>
                            <div style="width: 110px; padding: 0; margin: 0;">
                                <input type="text" id="txt_sex" onkeyup="replaceSpecialSymbol(this)" class="inputText wf100" style="width: 100px;" />
                            </div>
                        </div>
                        <div>
                            <span class="title" style="padding-right: 0px;"><a class="button" id="btn_search" onclick="query()">查询</a></span>
                        </div>
                    </div>
                    <div class="clear height10">
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" height="400" style="min-width: 1185px">
                        <tr>
                            <td valign="top">
                                <div class="clear">
                                </div>
                                <div id="dvOrders">
                                    <div class="shadowBoxWhite" style="width: 98%; padding: 10px 1%;">
                                        <div id="divbutton" runat="server" style="margin: 0 0 10px 0px;">
                                            <input type="image" id="img_zdy" src="/Images/setzdy.png" title="自定义显示列" style="width: 21px; height: 20px; margin-bottom: -5px; margin-right: 3px;" onclick=" return dozdy();" />
                                            <a class="button blueButton" id="btnAdd" onclick="Add()">新增</a>
                                            <a class="button blueButton" id="btnUpdate" onclick="Update()">修改</a>
                                            <a class="button redButton" id="btnDelete" onclick="deleteBtn()">删除</a>
                                        </div>
                                        <div>
                                            <table id="JqGridList"></table>
                                            <div id="JqGridPage"></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </form>
</body>
</html>
